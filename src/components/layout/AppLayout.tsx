import React from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <span className="text-4xl">🌙</span>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  // No layout for unauthenticated users (auth page handles its own layout)
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-20 md:pb-4 overflow-y-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
