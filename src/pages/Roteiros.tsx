import { useEffect, useState } from "react";
import { Plus, Map, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Roteiro = {
  id: string;
  titulo: string;
  descricao: string | null;
  activities: number;
};

const Roteiros = () => {
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoteiros();
  }, []);

  const fetchRoteiros = async () => {
    try {
      const { data, error } = await supabase
        .from("roteiros")
        .select(`
          id,
          titulo,
          descricao,
          atividades_roteiro(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const roteirosFormatted = data?.map((r: any) => ({
        id: r.id,
        titulo: r.titulo,
        descricao: r.descricao,
        activities: r.atividades_roteiro?.[0]?.count || 0,
      })) || [];

      setRoteiros(roteirosFormatted);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar roteiros",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("roteiros").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Roteiro excluído com sucesso!" });
      fetchRoteiros();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir roteiro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen p-6">Carregando...</div>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Meus Roteiros</h1>
          <p className="text-muted-foreground mt-1">
            Crie e organize suas atividades de viagem
          </p>
        </div>
        <Link to="/roteiros/novo">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Novo Roteiro</span>
          </Button>
        </Link>
      </div>

      {/* Lista de roteiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roteiros.map((roteiro) => (
          <Card key={roteiro.id} className="p-5 hover:shadow-medium transition-smooth">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{roteiro.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{roteiro.descricao}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ml-3">
                  <Map className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {roteiro.activities} atividades
                </span>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(roteiro.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {roteiros.length === 0 && (
        <Card className="p-8 text-center space-y-4 border-dashed">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Nenhum roteiro criado</h3>
            <p className="text-sm text-muted-foreground">
              Crie seu primeiro roteiro com atividades para sua viagem
            </p>
          </div>
          <Link to="/roteiros/novo">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Roteiro
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default Roteiros;
