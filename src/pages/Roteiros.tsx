import { Plus, Calendar, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Roteiros = () => {
  const myItineraries = [
    {
      id: 1,
      title: "Minha Viagem a Lisboa",
      status: "Rascunho",
      visibility: "Privado",
      activities: 12,
      days: 3,
      icon: Lock,
    },
    {
      id: 2,
      title: "Praias do Sul",
      status: "Completo",
      visibility: "Público",
      activities: 8,
      days: 5,
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="gradient-primary p-6 rounded-b-3xl shadow-medium">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-primary-foreground">Meus Roteiros</h1>
          <Button size="sm" variant="secondary" className="gap-2">
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </div>
        <p className="text-primary-foreground/90 text-sm">
          Crie e organize seus roteiros de viagem
        </p>
      </div>

      {/* Lista de roteiros */}
      <div className="p-6 space-y-4">
        {myItineraries.map((itinerary) => {
          const Icon = itinerary.icon;
          return (
            <Card key={itinerary.id} className="p-4 shadow-soft hover:shadow-medium transition-smooth cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{itinerary.title}</h3>
                    <Badge 
                      variant={itinerary.status === "Completo" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {itinerary.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{itinerary.days} dias</span>
                    </div>
                    <span>•</span>
                    <span>{itinerary.activities} atividades</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {itinerary.visibility}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Empty state */}
        <Card className="p-8 text-center space-y-4 border-dashed">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Comece seu primeiro roteiro</h3>
            <p className="text-sm text-muted-foreground">
              Crie roteiros personalizados para suas viagens
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Criar Roteiro
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Roteiros;
