import { useEffect, useState } from "react";
import { User, Map, Calendar, MessageSquare, Settings, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Perfil = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState([
    { label: "Roteiros", value: 0, icon: Map },
    { label: "Itinerários", value: 0, icon: Calendar },
    { label: "Postagens", value: 0, icon: MessageSquare },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const [profileRes, roteirosRes, itinerariosRes, publicacoesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("roteiros").select("id", { count: "exact" }),
        supabase.from("itinerarios").select("id", { count: "exact" }),
        supabase.from("publicacoes").select("id", { count: "exact" }),
      ]);

      setProfile(profileRes.data);
      setStats([
        { label: "Roteiros", value: roteirosRes.count || 0, icon: Map },
        { label: "Itinerários", value: itinerariosRes.count || 0, icon: Calendar },
        { label: "Postagens", value: publicacoesRes.count || 0, icon: MessageSquare },
      ]);
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header com gradient */}
      <div className="gradient-primary p-6 sm:p-8 pb-20">
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Configurações</span>
          </Button>
          <Button variant="secondary" size="sm" className="gap-2" onClick={signOut}>
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 sm:px-6 -mt-12">
        <Card className="p-6 shadow-medium">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{profile?.nome?.[0] || "?"}</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold">{profile?.nome || "Usuário"}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>

            <Button variant="outline" size="sm">
              Editar Perfil
            </Button>
          </div>
        </Card>
      </div>

      {/* Stats */}
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bio */}
        <Card className="p-6">
          <h2 className="font-semibold mb-3">Sobre</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Apaixonado por viagens e descobrir novos lugares. Adoro compartilhar experiências 
            e dicas de roteiros para ajudar outros viajantes.
          </p>
        </Card>

        {/* Preferências */}
        <Card className="p-6">
          <h2 className="font-semibold mb-3">Interesses de Viagem</h2>
          <div className="flex flex-wrap gap-2">
            {["Natureza", "Cultura", "Gastronomia", "Aventura", "Praia"].map((interest) => (
              <span 
                key={interest}
                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;
