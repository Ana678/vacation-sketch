import { Settings, MapPin, Calendar, Award, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Perfil = () => {
  const stats = [
    { label: "Roteiros", value: "8" },
    { label: "Seguindo", value: "24" },
    { label: "Seguidores", value: "156" },
  ];

  const menuItems = [
    { icon: MapPin, label: "Meus Roteiros", badge: "8" },
    { icon: Calendar, label: "Viagens Realizadas", badge: "3" },
    { icon: Award, label: "Conquistas", badge: "12" },
    { icon: Settings, label: "Configurações" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header com gradiente */}
      <div className="gradient-hero p-6 pb-12 rounded-b-3xl shadow-medium">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-card shadow-lg">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary-foreground">Usuário Demo</h1>
            <p className="text-sm text-primary-foreground/90">@usuario_demo</p>
            <Badge variant="secondary" className="mt-2">
              Viajante
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-xs text-primary-foreground/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="p-6">
        <Card className="p-4 shadow-soft">
          <p className="text-sm text-muted-foreground">
            Apaixonado por viagens e culturas. Sempre em busca de novos destinos e experiências únicas. 🌍✈️
          </p>
        </Card>
      </div>

      {/* Menu */}
      <div className="px-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card 
              key={item.label}
              className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-medium transition-smooth shadow-soft"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary">{item.badge}</Badge>
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Card>
          );
        })}
      </div>

      <div className="p-6">
        <Button variant="outline" className="w-full">
          Editar Perfil
        </Button>
      </div>
    </div>
  );
};

export default Perfil;
