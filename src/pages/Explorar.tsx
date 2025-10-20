import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ItineraryCard from "@/components/cards/ItineraryCard";

const Explorar = () => {
  const categories = [
    "Todos",
    "Natureza",
    "Cultura",
    "Gastronomia",
    "Aventura",
    "Praia",
    "Montanha",
  ];

  const itineraries = [
    {
      id: 1,
      title: "Rota dos Vinhos do Douro",
      location: "Douro, Portugal",
      duration: "4 dias",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      tags: ["Gastronomia", "Vinhos", "Natureza"],
    },
    {
      id: 2,
      title: "Serra da Estrela no Inverno",
      location: "Serra da Estrela, Portugal",
      duration: "3 dias",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      tags: ["Natureza", "Aventura", "Neve"],
    },
    {
      id: 3,
      title: "Caminho de Santiago",
      location: "Norte de Portugal",
      duration: "7 dias",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      tags: ["Aventura", "Cultura", "Caminhada"],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-card p-6 border-b border-border sticky top-0 z-10 shadow-soft">
        <h1 className="text-2xl font-bold mb-4">Explorar</h1>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar roteiros..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Categorias */}
        <div className="flex gap-2 overflow-x-auto pb-2 mt-4 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === "Todos" ? "default" : "outline"}
              className="cursor-pointer transition-smooth hover:bg-primary hover:text-primary-foreground whitespace-nowrap"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Grid de roteiros */}
      <div className="p-6 space-y-4">
        {itineraries.map((itinerary) => (
          <ItineraryCard key={itinerary.id} {...itinerary} />
        ))}
      </div>
    </div>
  );
};

export default Explorar;
