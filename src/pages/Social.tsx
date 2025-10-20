import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Social = () => {
  const posts = [
    {
      id: 1,
      user: {
        name: "Maria Silva",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        isGuide: true,
      },
      content: "Acabei de criar um roteiro incrível para explorar o Porto em 2 dias! 🌉",
      itinerary: {
        title: "Porto Encantador",
        location: "Porto, Portugal",
        image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
      },
      likes: 42,
      comments: 8,
      isLiked: false,
    },
    {
      id: 2,
      user: {
        name: "João Santos",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
        isGuide: false,
      },
      content: "Que experiência maravilhosa no Algarve! Recomendo muito esse roteiro 🏖️",
      itinerary: {
        title: "Praias Secretas do Algarve",
        location: "Algarve, Portugal",
        image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800&q=80",
      },
      likes: 67,
      comments: 12,
      isLiked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border sticky top-0 z-10 shadow-soft">
        <h1 className="text-2xl font-bold">Feed Social</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Descubra roteiros da comunidade
        </p>
      </div>

      {/* Posts */}
      <div className="p-4 space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden shadow-soft">
            {/* User info */}
            <div className="p-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.user.avatar} />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{post.user.name}</p>
                  {post.user.isGuide && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                      Guia
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">há 2 horas</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-sm">{post.content}</p>
            </div>

            {/* Itinerary preview */}
            <div className="px-4 pb-4">
              <Card className="overflow-hidden border border-border">
                <img 
                  src={post.itinerary.image} 
                  alt={post.itinerary.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-sm mb-1">{post.itinerary.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{post.itinerary.location}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`gap-2 ${post.isLiked ? "text-destructive" : ""}`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? "fill-destructive" : ""}`} />
                <span className="text-xs">{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{post.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Social;
