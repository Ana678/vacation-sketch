import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plane, X } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [interesses, setInteresses] = useState<string[]>([]);
  const [interesseInput, setInteresseInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const addInteresse = () => {
    if (interesseInput.trim() && !interesses.includes(interesseInput.trim())) {
      setInteresses([...interesses, interesseInput.trim()]);
      setInteresseInput("");
    }
  };

  const removeInteresse = (interesse: string) => {
    setInteresses(interesses.filter((i) => i !== interesse));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Login realizado com sucesso!" });
        navigate("/");
      } else {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nome },
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (authError) throw authError;
        
        // Atualizar perfil com dados opcionais
        if (authData.user && (avatarUrl || bio || interesses.length > 0)) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              avatar_url: avatarUrl || null,
              bio: bio || null,
              interesses: interesses.length > 0 ? interesses : null,
            })
            .eq("id", authData.user.id);
          
          if (profileError) console.error("Erro ao atualizar perfil:", profileError);
        }
        
        toast({ title: "Conta criada com sucesso!" });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-primary">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Roteiros de Viagem</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Faça login para continuar" : "Crie sua conta"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Foto de Perfil (URL) - Opcional</Label>
                <Input
                  id="avatarUrl"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio - Opcional</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interesses">Interesses - Opcional</Label>
                <div className="flex gap-2">
                  <Input
                    id="interesses"
                    placeholder="Ex: Praia, Cultura, Aventura"
                    value={interesseInput}
                    onChange={(e) => setInteresseInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addInteresse())}
                  />
                  <Button type="button" onClick={addInteresse} variant="outline">
                    Adicionar
                  </Button>
                </div>
                {interesses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interesses.map((interesse) => (
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
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin
              ? "Não tem conta? Cadastre-se"
              : "Já tem conta? Faça login"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
