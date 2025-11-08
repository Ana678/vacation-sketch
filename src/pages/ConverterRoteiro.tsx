import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, GripVertical, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Atividade = {
  id: string;
  nome: string;
  local: string;
  ordem: number;
  horario: string;
};

type Roteiro = {
  id: string;
  titulo: string;
  descricao: string | null;
};

const SortableAtividade = ({ atividade, onHorarioChange }: { atividade: Atividade; onHorarioChange: (id: string, horario: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: atividade.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing pt-1">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h4 className="font-semibold">{atividade.nome}</h4>
            <p className="text-sm text-muted-foreground">{atividade.local}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <Input
              type="time"
              value={atividade.horario}
              onChange={(e) => onHorarioChange(atividade.id, e.target.value)}
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ConverterRoteiro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [local, setLocal] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchRoteiroData();
  }, [id]);

  const fetchRoteiroData = async () => {
    try {
      const { data: roteiroData, error: roteiroError } = await supabase
        .from("roteiros")
        .select("id, titulo, descricao")
        .eq("id", id)
        .single();

      if (roteiroError) throw roteiroError;
      setRoteiro(roteiroData);

      const { data: atividadesData, error: atividadesError } = await supabase
        .from("atividades_roteiro")
        .select(`
          atividade_id,
          ordem,
          atividades (
            id,
            nome,
            local
          )
        `)
        .eq("roteiro_id", id)
        .order("ordem", { ascending: true });

      if (atividadesError) throw atividadesError;

      const formatted = atividadesData.map((ar: any) => ({
        id: ar.atividades.id,
        nome: ar.atividades.nome,
        local: ar.atividades.local,
        ordem: ar.ordem,
        horario: "09:00",
      }));

      setAtividades(formatted);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar roteiro",
        description: error.message,
        variant: "destructive",
      });
      navigate("/roteiros");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setAtividades((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleHorarioChange = (id: string, horario: string) => {
    setAtividades((items) =>
      items.map((item) => (item.id === id ? { ...item, horario } : item))
    );
  };

  const handleSave = async () => {
    if (!dataInicio || !dataFim) {
      toast({
        title: "Erro",
        description: "Preencha as datas de início e fim",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const dias = Math.ceil(
        (new Date(dataFim).getTime() - new Date(dataInicio).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      const { data: itinerario, error: itinerarioError } = await supabase
        .from("itinerarios")
        .insert({
          titulo: roteiro?.titulo || "",
          descricao: roteiro?.descricao,
          local: local || null,
          data_inicio: dataInicio,
          data_fim: dataFim,
          dias,
          roteiro_id: id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: "planejado",
        })
        .select()
        .single();

      if (itinerarioError) throw itinerarioError;

      const atividadesItinerario = atividades.map((ativ, index) => ({
        itinerario_id: itinerario.id,
        atividade_id: ativ.id,
        ordem: index,
        dia: 1,
        horario: ativ.horario,
      }));

      const { error: atividadesError } = await supabase
        .from("atividades_itinerario")
        .insert(atividadesItinerario);

      if (atividadesError) throw atividadesError;

      toast({
        title: "Sucesso!",
        description: "Itinerário criado com sucesso",
      });

      navigate("/itinerarios");
    } catch (error: any) {
      toast({
        title: "Erro ao criar itinerário",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen p-6">Carregando...</div>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/roteiros")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Converter em Itinerário</h1>
          <p className="text-muted-foreground mt-1">{roteiro?.titulo}</p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="local">Local</Label>
            <Input
              id="local"
              type="text"
              placeholder="Ex: São Paulo"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold">Atividades - Arraste para reordenar</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={atividades.map((a) => a.id)} strategy={verticalListSortingStrategy}>
            {atividades.map((atividade) => (
              <SortableAtividade
                key={atividade.id}
                atividade={atividade}
                onHorarioChange={handleHorarioChange}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
        <Save className="w-4 h-4" />
        {saving ? "Criando..." : "Criar Itinerário"}
      </Button>
    </div>
  );
};

export default ConverterRoteiro;
