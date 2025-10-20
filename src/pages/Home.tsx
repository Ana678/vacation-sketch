import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import ItineraryCard from "@/components/cards/ItineraryCard";

const Home = () => {
  const recommendedItineraries = [
    {
      id: 1,
      title: "Lisboa em 3 Dias",
      location: "Lisboa, Portugal",
      duration: "3 dias",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
      tags: ["Cultura", "Gastronomia", "História"],
      isLiked: true,
    },
    {
      id: 2,
      title: "Praias do Algarve",
      location: "Algarve, Portugal",
      duration: "5 dias",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800&q=80",
      tags: ["Natureza", "Praia", "Relaxamento"],
      isLiked: false,
    },
    {
      id: 3,
      title: "Porto Histórico",
      location: "Porto, Portugal",
      duration: "2 dias",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80",
      tags: ["Cultura", "Vinhos", "Fotografia"],
      isLiked: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header com gradiente */}
      <div className="gradient-hero p-6 pb-8 rounded-b-3xl shadow-medium">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary-foreground">
            <Sparkles className="w-5 h-5" />
            <h1 className="text-2xl font-bold">Roteiros de Viagem</h1>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar destinos, roteiros..." 
              className="pl-10 bg-card/95 backdrop-blur-sm border-0 shadow-soft"
            />
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="p-6 space-y-6">
        {/* Recomendações de IA */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold">Recomendados para você</h2>
          </div>
          <div className="space-y-4">
            {recommendedItineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} {...itinerary} />
            ))}
          </div>
        </section>

        {/* Favoritos recentes */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Seus favoritos</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {recommendedItineraries.slice(0, 2).map((itinerary) => (
              <div key={itinerary.id} className="flex-shrink-0 w-64">
                <ItineraryCard {...itinerary} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
