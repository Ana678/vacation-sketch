import { useEffect, useState } from "react";
import { User, Map, Calendar, MessageSquare, Settings, LogOut, X, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Perfil = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome: "",
    avatar_url: "",
    bio: "",
    interesses: [] as string[],
  });
  const [interesseInput, setInteresseInput] = useState("");
  const [stats, setStats] = useState([
    { label: "Roteiros", value: 0, icon: Map },
    { label: "Itinerários", value: 0, icon: Calendar },
    { label: "Postagens", value: 0, icon: MessageSquare },
  ]);

  const addInteresse = () => {
    if (interesseInput.trim() && !editData.interesses.includes(interesseInput.trim())) {
      setEditData({ ...editData, interesses: [...editData.interesses, interesseInput.trim()] });
      setInteresseInput("");
    }
  };

  const removeInteresse = (interesse: string) => {
    setEditData({ ...editData, interesses: editData.interesses.filter((i) => i !== interesse) });
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from("profiles")
      .update({
        nome: editData.nome,
        avatar_url: editData.avatar_url || null,
        bio: editData.bio || null,
        interesses: editData.interesses.length > 0 ? editData.interesses : null,
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Perfil atualizado com sucesso!" });
      setProfile({ ...profile, ...editData });
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const [profileRes, roteirosRes, itinerariosRes, publicacoesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("roteiros").select("id", { count: "exact" }),
        supabase.from("itinerarios").select("id", { count: "exact" }),
        supabase.from("publicacoes").select("id", { count: "exact" }),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setEditData({
          nome: profileRes.data.nome || "",
          avatar_url: profileRes.data.avatar_url || "",
          bio: profileRes.data.bio || "",
          interesses: profileRes.data.interesses || [],
        });
      }
      
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

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Editar Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nome">Nome</Label>
                    <Input
                      id="edit-nome"
                      value={editData.nome}
                      onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-avatar">Foto de Perfil (URL)</Label>
                    <Input
                      id="edit-avatar"
                      placeholder="https://exemplo.com/foto.jpg"
                      value={editData.avatar_url}
                      onChange={(e) => setEditData({ ...editData, avatar_url: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-bio">Bio</Label>
                    <Textarea
                      id="edit-bio"
                      placeholder="Conte um pouco sobre você..."
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-interesses">Interesses</Label>
                    <div className="flex gap-2">
                      <Input
                        id="edit-interesses"
                        placeholder="Adicionar interesse"
                        value={interesseInput}
                        onChange={(e) => setInteresseInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInteresse())}
                      />
                      <Button type="button" onClick={addInteresse} variant="outline" size="sm">
                        Adicionar
                      </Button>
                    </div>
                    {editData.interesses.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editData.interesses.map((interesse) => (
                          <span
                            key={interesse}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1"
                          >
                            {interesse}
                            <button
                              type="button"
                              onClick={() => removeInteresse(interesse)}
                              className="hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button onClick={handleSaveProfile} className="w-full">
                    Salvar Alterações
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
        {profile?.bio && (
          <Card className="p-6">
            <h2 className="font-semibold mb-3">Sobre</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {profile.bio}
            </p>
          </Card>
        )}

        {/* Preferências */}
        {profile?.interesses && profile.interesses.length > 0 && (
          <Card className="p-6">
            <h2 className="font-semibold mb-3">Interesses de Viagem</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interesses.map((interesse: string) => (
                <span 
                  key={interesse}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {interesse}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Perfil;
