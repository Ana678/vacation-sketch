import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Atividade = {
  id: string;
  nome: string;
  local: string;
  horario: string;
  concluida: boolean;
};

type Itinerario = {
  id: string;
  titulo: string;
  local: string | null;
  status: string;
};

const ExecutarItinerario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [itinerario, setItinerario] = useState<Itinerario | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: itinerarioData, error: itinerarioError } = await supabase
        .from("itinerarios")
        .select("id, titulo, local, status")
        .eq("id", id)
        .single();

      if (itinerarioError) throw itinerarioError;
      setItinerario(itinerarioData);

      const { data: atividadesData, error: atividadesError } = await supabase
        .from("atividades_itinerario")
        .select(`
          id,
          horario,
          concluida,
          atividades (
            id,
            nome,
            local
          )
        `)
        .eq("itinerario_id", id)
        .order("ordem", { ascending: true });

      if (atividadesError) throw atividadesError;

      const formatted = atividadesData.map((ai: any) => ({
        id: ai.id,
        nome: ai.atividades.nome,
        local: ai.atividades.local,
        horario: ai.horario || "Sem horário",
        concluida: ai.concluida,
      }));

      setAtividades(formatted);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar itinerário",
        description: error.message,
        variant: "destructive",
      });
      navigate("/itinerarios");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAtividade = async (atividadeId: string, concluida: boolean) => {
    try {
      const { error } = await supabase
        .from("atividades_itinerario")
        .update({ concluida })
        .eq("id", atividadeId);

      if (error) throw error;

      setAtividades((prev) =>
        prev.map((a) => (a.id === atividadeId ? { ...a, concluida } : a))
      );

      const allCompleted = atividades.every((a) =>
        a.id === atividadeId ? concluida : a.concluida
      );

      if (allCompleted) {
        await finalizarItinerario();
      }
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar atividade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const finalizarItinerario = async () => {
    try {
      const { error } = await supabase
        .from("itinerarios")
        .update({ status: "concluido" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Parabéns! 🎉",
        description: "Itinerário concluído com sucesso!",
      });

      setTimeout(() => navigate("/itinerarios"), 2000);
    } catch (error: any) {
      toast({
        title: "Erro ao finalizar itinerário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const iniciarItinerario = async () => {
    try {
      const { error } = await supabase
        .from("itinerarios")
        .update({ status: "em_andamento" })
        .eq("id", id);

      if (error) throw error;

      setItinerario((prev) => (prev ? { ...prev, status: "em_andamento" } : null));

      toast({
        title: "Itinerário iniciado!",
        description: "Boa viagem! Marque as atividades conforme as completa.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar itinerário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen p-6">Carregando...</div>;
  }

  const completedCount = atividades.filter((a) => a.concluida).length;
  const progress = (completedCount / atividades.length) * 100;

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/itinerarios")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{itinerario?.titulo}</h1>
          {itinerario?.local && (
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span>{itinerario.local}</span>
            </div>
          )}
        </div>
      </div>

      {itinerario?.status === "planejado" && (
        <Card className="p-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 mx-auto text-primary" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Pronto para começar?</h3>
              <p className="text-sm text-muted-foreground">
                Clique no botão abaixo para iniciar seu itinerário
              </p>
            </div>
            <Button onClick={iniciarItinerario} className="gap-2">
              Começar Itinerário
            </Button>
          </div>
        </Card>
      )}

      {itinerario?.status !== "planejado" && (
        <>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progresso</span>
                <span className="text-muted-foreground">
                  {completedCount} de {atividades.length} concluídas
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </Card>

          <div className="space-y-3">
            {atividades.map((atividade) => (
              <Card
                key={atividade.id}
                className={`p-4 transition-all ${
                  atividade.concluida ? "opacity-60 bg-muted/50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={atividade.concluida}
                    onCheckedChange={(checked) =>
                      handleToggleAtividade(atividade.id, checked as boolean)
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h4
                      className={`font-semibold ${
                        atividade.concluida ? "line-through" : ""
                      }`}
                    >
                      {atividade.nome}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {atividade.local}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                      <Clock className="w-3 h-3" />
                      <span>{atividade.horario}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExecutarItinerario;
