import { Calendar, Clock, Star, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Itinerarios = () => {
  const itinerarios = [
    {
      id: 1,
      title: "Lisboa em 3 dias",
      location: "Lisboa, Portugal",
      startDate: "15/03/2024",
      days: 3,
      activities: 12,
      status: "concluido",
      rating: 5,
    },
    {
      id: 2,
      title: "Porto e Douro",
      location: "Porto, Portugal",
      startDate: "22/03/2024",
      days: 5,
      activities: 18,
      status: "em_andamento",
    },
    {
      id: 3,
      title: "Algarve Completo",
      location: "Algarve, Portugal",
      startDate: "05/04/2024",
      days: 7,
      activities: 20,
      status: "planejado",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "concluido":
        return <Badge className="bg-secondary text-secondary-foreground">Concluído</Badge>;
      case "em_andamento":
        return <Badge className="bg-accent text-accent-foreground">Em andamento</Badge>;
      case "planejado":
        return <Badge variant="outline">Planejado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Meus Itinerários</h1>
        <p className="text-muted-foreground mt-1">
          Organize suas atividades por dias e horários
        </p>
      </div>

      {/* Lista de itinerários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {itinerarios.map((itinerario) => (
          <Link key={itinerario.id} to={`/itinerarios/${itinerario.id}`}>
            <Card className="overflow-hidden hover:shadow-medium transition-smooth h-full">
              <div className="h-32 gradient-primary flex items-center justify-center">
                <Calendar className="w-12 h-12 text-primary-foreground" />
              </div>
              
              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{itinerario.title}</h3>
                    {getStatusBadge(itinerario.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{itinerario.location}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{itinerario.days} dias</span>
                  </div>
                  <span>•</span>
                  <span>{itinerario.activities} atividades</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Início: {itinerario.startDate}
                  </span>
                  {itinerario.status === "concluido" && itinerario.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-medium">{itinerario.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {itinerarios.length === 0 && (
        <Card className="p-8 text-center space-y-4 border-dashed">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Nenhum itinerário criado</h3>
            <p className="text-sm text-muted-foreground">
              Transforme seus roteiros em itinerários com dias e horários
            </p>
          </div>
          <Link to="/roteiros">
            <Button className="gap-2">
              <Check className="w-4 h-4" />
              Ver Meus Roteiros
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default Itinerarios;
