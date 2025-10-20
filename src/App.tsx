import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MobileLayout from "./components/layout/MobileLayout";
import Home from "./pages/Home";
import Roteiros from "./pages/Roteiros";
import Itinerarios from "./pages/Itinerarios";
import Social from "./pages/Social";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roteiros" element={<Roteiros />} />
            <Route path="/itinerarios" element={<Itinerarios />} />
            <Route path="/postagens" element={<Social />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
