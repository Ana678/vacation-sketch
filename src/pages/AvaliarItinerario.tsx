import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Atividade = {
  id: string;
  nome: string;
  local: string;
  dia: number;
  horario: string | null;
  avaliacao?: {
    id: string;
    nota: number;
    comentario: string | null;
  };
};

type Itinerario = {
  titulo: string;
  local: string | null;
};

const AvaliarItinerario = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [itinerario, setItinerario] = useState<Itinerario | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAtividade, setSelectedAtividade] = useState<string | null>(null);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar itinerário
      const { data: itinerarioData, error: itinerarioError } = await supabase
        .from("itinerarios")
        .select("titulo, local")
        .eq("id", id)
        .single();

      if (itinerarioError) throw itinerarioError;
      setItinerario(itinerarioData);

      // Buscar atividades com avaliações
      const { data: atividadesData, error: atividadesError } = await supabase
        .from("atividades_itinerario")
        .select(`
          id,
          dia,
          horario,
          atividades (
            id,
            nome,
            local
          )
        `)
        .eq("itinerario_id", id)
        .order("dia", { ascending: true })
        .order("horario", { ascending: true });

      if (atividadesError) throw atividadesError;

      // Buscar avaliações existentes
      const { data: avaliacoesData } = await supabase
        .from("avaliacoes")
        .select("*")
        .eq("itinerario_id", id)
        .eq("user_id", user.id);

      const atividadesFormatted = atividadesData?.map((ai: any) => ({
        id: ai.atividades.id,
        nome: ai.atividades.nome,
        local: ai.atividades.local,
        dia: ai.dia,
        horario: ai.horario,
        avaliacao: avaliacoesData?.find((av) => av.atividade_id === ai.atividades.id),
      })) || [];

      setAtividades(atividadesFormatted);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAtividade = (atividadeId: string) => {
    const atividade = atividades.find((a) => a.id === atividadeId);
    setSelectedAtividade(atividadeId);
    setNota(atividade?.avaliacao?.nota || 0);
    setComentario(atividade?.avaliacao?.comentario || "");
  };

  const handleSaveAvaliacao = async () => {
    if (!selectedAtividade || nota === 0) {
      toast({
        title: "Avaliação incompleta",
        description: "Por favor, selecione uma nota",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const atividade = atividades.find((a) => a.id === selectedAtividade);
      
      if (atividade?.avaliacao) {
        // Atualizar avaliação existente
        const { error } = await supabase
          .from("avaliacoes")
          .update({
            nota,
            comentario: comentario || null,
          })
          .eq("id", atividade.avaliacao.id);

        if (error) throw error;
      } else {
        // Criar nova avaliação
        const { error } = await supabase
          .from("avaliacoes")
          .insert({
            itinerario_id: id!,
            atividade_id: selectedAtividade,
            user_id: user.id,
            nota,
            comentario: comentario || null,
          });

        if (error) throw error;
      }

      toast({
        title: "Avaliação salva!",
        description: "Sua avaliação foi registrada com sucesso",
      });

      // Recarregar dados
      await fetchData();
      setSelectedAtividade(null);
      setNota(0);
      setComentario("");
    } catch (error: any) {
      toast({
        title: "Erro ao salvar avaliação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const atividadesAvaliadas = atividades.filter((a) => a.avaliacao).length;
  const totalAtividades = atividades.length;
  const progresso = totalAtividades > 0 ? (atividadesAvaliadas / totalAtividades) * 100 : 0;

  if (loading) {
    return <div className="min-h-screen p-6">Carregando...</div>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/itinerarios")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Avaliar Itinerário</h1>
          <p className="text-muted-foreground">{itinerario?.titulo}</p>
        </div>
      </div>

      {/* Progresso */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Progresso da Avaliação</h3>
            <p className="text-sm text-muted-foreground">
              {atividadesAvaliadas} de {totalAtividades} atividades avaliadas
            </p>
          </div>
          <div className="text-2xl font-bold text-primary">
            {Math.round(progresso)}%
          </div>
        </div>
        <Progress value={progresso} />
      </Card>

      {/* Lista de Atividades */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Atividades</h2>
        {atividades.map((atividade) => (
          <Card
            key={atividade.id}
            className={`p-4 cursor-pointer transition-smooth hover:shadow-medium ${
              selectedAtividade === atividade.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleSelectAtividade(atividade.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
                    Dia {atividade.dia}
                  </span>
                  {atividade.horario && (
                    <span className="text-xs text-muted-foreground">
                      {atividade.horario}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold">{atividade.nome}</h3>
                <p className="text-sm text-muted-foreground">{atividade.local}</p>
                {atividade.avaliacao && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= atividade.avaliacao!.nota
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {atividade.avaliacao && (
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Formulário de Avaliação */}
      {selectedAtividade && (
        <Card className="p-6 space-y-4 fixed bottom-0 left-0 right-0 rounded-t-xl shadow-strong sm:static sm:rounded-xl">
          <h3 className="font-semibold">Avaliar Atividade</h3>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Nota</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNota(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-smooth ${
                      star <= nota
                        ? "fill-accent text-accent"
                        : "text-muted-foreground hover:text-accent"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Comentário (opcional)
            </label>
            <Textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Compartilhe sua experiência..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedAtividade(null);
                setNota(0);
                setComentario("");
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAvaliacao}
              disabled={saving || nota === 0}
              className="flex-1"
            >
              {saving ? "Salvando..." : "Salvar Avaliação"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AvaliarItinerario;
