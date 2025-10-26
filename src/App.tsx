import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MobileLayout from "./components/layout/MobileLayout";
import Home from "./pages/Home";
import Roteiros from "./pages/Roteiros";
import Itinerarios from "./pages/Itinerarios";
import Social from "./pages/Social";
import Perfil from "./pages/Perfil";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MobileLayout>
                <Home />
              </MobileLayout>
            </ProtectedRoute>
          } />
          <Route path="/roteiros" element={
            <ProtectedRoute>
              <MobileLayout>
                <Roteiros />
              </MobileLayout>
            </ProtectedRoute>
          } />
          <Route path="/itinerarios" element={
            <ProtectedRoute>
              <MobileLayout>
                <Itinerarios />
              </MobileLayout>
            </ProtectedRoute>
          } />
          <Route path="/postagens" element={
            <ProtectedRoute>
              <MobileLayout>
                <Social />
              </MobileLayout>
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <MobileLayout>
                <Perfil />
              </MobileLayout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
