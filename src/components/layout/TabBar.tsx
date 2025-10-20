import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Map, Heart, User } from "lucide-react";

const TabBar = () => {
  const location = useLocation();
  
  const tabs = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explorar", icon: Compass, label: "Explorar" },
    { path: "/roteiros", icon: Map, label: "Roteiros" },
    { path: "/social", icon: Heart, label: "Social" },
    { path: "/perfil", icon: User, label: "Perfil" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-strong z-50">
      <div className="flex items-center justify-around h-16 max-w-screen-sm mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-smooth ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${active ? "fill-primary" : ""}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default TabBar;
