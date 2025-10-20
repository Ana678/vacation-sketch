import { Heart, MessageCircle, Send, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Social = () => {
  const posts = [
    {
      id: 1,
      user: {
        name: "Maria Silva",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      content: "Acabei de voltar de uma viagem incrível por Lisboa! A cidade é simplesmente encantadora 🌉✨",
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
      likes: 42,
      comments: [
        { user: "João Santos", text: "Que legal! Quais lugares você visitou?" },
        { user: "Ana Costa", text: "Lisboa é maravilhosa mesmo! 💙" },
      ],
      isLiked: false,
      timestamp: "há 2 horas",
    },
    {
      id: 2,
      user: {
        name: "Carlos Mendes",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      },
      content: "Dia perfeito nas praias do Algarve! Sol, mar e muita tranquilidade 🏖️",
      image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800&q=80",
      likes: 67,
      comments: [
        { user: "Paula Reis", text: "Que inveja! Aproveite muito!" },
      ],
      isLiked: true,
      timestamp: "há 5 horas",
    },
  ];

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
          <Link to="/postagens/nova">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Postagem</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Posts */}
      <div className="p-4 sm:px-6 max-w-2xl mx-auto space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden shadow-soft">
            {/* User info */}
            <div className="p-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{post.user.name}</p>
                <p className="text-xs text-muted-foreground">{post.timestamp}</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-sm">{post.content}</p>
            </div>

            {/* Image */}
            {post.image && (
              <img 
                src={post.image} 
                alt="Post"
                className="w-full object-cover max-h-96"
              />
            )}

            {/* Actions */}
            <div className="px-4 py-3 flex items-center gap-4 border-b border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 ${post.isLiked ? "text-destructive" : ""}`}
              >
                <Heart className={`w-5 h-5 ${post.isLiked ? "fill-destructive" : ""}`} />
                <span className="text-sm">{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments.length}</span>
              </Button>
            </div>

            {/* Comments */}
            <div className="p-4 space-y-3">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex gap-2 text-sm">
                  <span className="font-semibold">{comment.user}</span>
                  <span className="text-muted-foreground">{comment.text}</span>
                </div>
              ))}
              
              {/* Add comment */}
              <div className="flex items-center gap-2 pt-2">
                <Input 
                  placeholder="Adicionar um comentário..."
                  className="flex-1"
                />
                <Button size="sm" variant="ghost">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Social;
