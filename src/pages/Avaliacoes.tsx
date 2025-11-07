import { useEffect, useState } from "react";
import { Star, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Avaliacao = {
  id: string;
  nota: number;
  comentario: string | null;
  created_at: string;
  atividade: {
    nome: string;
    local: string;
  };
  itinerario: {
    id: string;
    titulo: string;
    local: string | null;
  };
};

type ItinerarioStats = {
  id: string;
  titulo: string;
  local: string | null;
  totalAtividades: number;
  avaliadasCount: number;
  mediaNotas: number;
};

const Avaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [itinerariosStats, setItinerariosStats] = useState<ItinerarioStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar todas as avaliações do usuário
      const { data: avaliacoesData, error: avaliacoesError } = await supabase
        .from("avaliacoes")
        .select(`
          id,
          nota,
          comentario,
          created_at,
          atividades (
            nome,
            local
          ),
          itinerarios (
            id,
            titulo,
            local
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (avaliacoesError) throw avaliacoesError;

      const avaliacoesFormatted = avaliacoesData?.map((av: any) => ({
        id: av.id,
        nota: av.nota,
        comentario: av.comentario,
        created_at: new Date(av.created_at).toLocaleDateString("pt-BR"),
        atividade: {
          nome: av.atividades.nome,
          local: av.atividades.local,
        },
        itinerario: {
          id: av.itinerarios.id,
          titulo: av.itinerarios.titulo,
          local: av.itinerarios.local,
        },
      })) || [];

      setAvaliacoes(avaliacoesFormatted);

      // Buscar estatísticas por itinerário
      const { data: itinerariosData } = await supabase
        .from("itinerarios")
        .select(`
          id,
          titulo,
          local,
          atividades_itinerario (
            id,
            atividade_id
          )
        `)
        .eq("user_id", user.id);

      const stats = await Promise.all(
        itinerariosData?.map(async (it: any) => {
          const atividadeIds = it.atividades_itinerario.map((ai: any) => ai.atividade_id);
          
          const { data: avaliacoesIt } = await supabase
            .from("avaliacoes")
            .select("nota")
            .eq("itinerario_id", it.id)
            .eq("user_id", user.id);

          const mediaNotas = avaliacoesIt && avaliacoesIt.length > 0
            ? avaliacoesIt.reduce((acc, av) => acc + av.nota, 0) / avaliacoesIt.length
            : 0;

          return {
            id: it.id,
            titulo: it.titulo,
            local: it.local,
            totalAtividades: atividadeIds.length,
            avaliadasCount: avaliacoesIt?.length || 0,
            mediaNotas,
          };
        }) || []
      );

      setItinerariosStats(stats.filter((s) => s.avaliadasCount > 0));
    } catch (error: any) {
      toast({
        title: "Erro ao carregar avaliações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen p-6">Carregando...</div>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Histórico de Avaliações</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe todas as suas avaliações
        </p>
      </div>

      {/* Estatísticas por Itinerário */}
      {itinerariosStats.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Itinerários Avaliados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itinerariosStats.map((stat) => (
              <Link key={stat.id} to={`/itinerarios/${stat.id}/avaliar`}>
                <Card className="p-4 hover:shadow-medium transition-smooth">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold line-clamp-1">{stat.titulo}</h3>
                      {stat.local && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {stat.local}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {stat.avaliadasCount}/{stat.totalAtividades}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(stat.mediaNotas)
                              ? "fill-accent text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Média: {stat.mediaNotas.toFixed(1)}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Todas as Avaliações</h2>
        {avaliacoes.map((avaliacao) => (
          <Card key={avaliacao.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <Link
                  to={`/itinerarios/${avaliacao.itinerario.id}/avaliar`}
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  {avaliacao.itinerario.titulo}
                </Link>
                <h3 className="font-semibold mt-1">{avaliacao.atividade.nome}</h3>
                <p className="text-sm text-muted-foreground">
                  {avaliacao.atividade.local}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {avaliacao.created_at}
              </span>
            </div>

            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= avaliacao.nota
                      ? "fill-accent text-accent"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>

            {avaliacao.comentario && (
              <p className="text-sm text-muted-foreground mt-2 p-3 bg-muted rounded-md">
                {avaliacao.comentario}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {avaliacoes.length === 0 && (
        <Card className="p-8 text-center space-y-4 border-dashed">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
            <Star className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Nenhuma avaliação ainda</h3>
            <p className="text-sm text-muted-foreground">
              Comece avaliando suas atividades após concluir um itinerário
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Avaliacoes;
