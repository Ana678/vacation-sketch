import { Plus, Map, Edit, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Roteiros = () => {
  const roteiros = [
    {
      id: 1,
      title: "Lisboa Histórica",
      description: "Pontos turísticos principais da capital",
      activities: 8,
    },
    {
      id: 2,
      title: "Praias do Algarve",
      description: "Roteiro pelas melhores praias do sul",
      activities: 12,
    },
  ];

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
                  <h3 className="font-semibold text-lg mb-1">{roteiro.title}</h3>
                  <p className="text-sm text-muted-foreground">{roteiro.description}</p>
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
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Converter
                  </Button>
                  <Button variant="ghost" size="sm">
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
