import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Post = {
  id: string;
  texto: string;
  foto_url: string | null;
  created_at: string;
  profiles: {
    nome: string;
    avatar_url: string | null;
  };
};

const Social = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("publicacoes")
        .select(`
          id,
          texto,
          foto_url,
          created_at,
          user_id
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const postsWithProfiles = await Promise.all(
        (data || []).map(async (post) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("nome, avatar_url")
            .eq("id", post.user_id)
            .single();
          
          return {
            ...post,
            profiles: profile || { nome: "Usuário", avatar_url: null }
          };
        })
      );

      setPosts(postsWithProfiles as any);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar publicações",
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Postagens</h1>
            <p className="text-muted-foreground mt-1">
              Compartilhe suas experiências de viagem
            </p>
          </div>
          <Button className="gap-2" disabled>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Postagem</span>
          </Button>
        </div>
      </div>

      {/* Posts */}
      <div className="p-4 sm:px-6 max-w-2xl mx-auto space-y-6">
        {posts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nenhuma publicação ainda</p>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden shadow-soft">
              {/* User info */}
              <div className="p-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={post.profiles?.avatar_url || undefined} />
                  <AvatarFallback>{post.profiles?.nome?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{post.profiles?.nome || "Usuário"}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="px-4 pb-3">
                <p className="text-sm">{post.texto}</p>
              </div>

              {/* Image */}
              {post.foto_url && (
                <img 
                  src={post.foto_url} 
                  alt="Post"
                  className="w-full object-cover max-h-96"
                />
              )}

              {/* Actions */}
              <div className="px-4 py-3 flex items-center gap-4 border-b border-border">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">0</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm">0</span>
                </Button>
              </div>

              {/* Add comment */}
              <div className="p-4 flex items-center gap-2">
                <Input 
                  placeholder="Adicionar um comentário..."
                  className="flex-1"
                />
                <Button size="sm" variant="ghost">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Social;
