import { ReactNode } from "react";
import TabBar from "./TabBar";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="max-w-screen-sm mx-auto">
        {children}
      </main>
      <TabBar />
    </div>
  );
};

export default MobileLayout;
