import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Calendar, MessageCircle, Store, Shield, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin, isBusiness } = useAuth();
  const location = useLocation();

  const items = [
    { path: "/", icon: Home, label: t("navHome"), emoji: "🏠" },
    { path: "/athkar", icon: BookOpen, label: t("navAthkar"), emoji: "📿" },
    { path: "/events", icon: Calendar, label: t("navEvents"), emoji: "📅" },
    { path: "/chat", icon: MessageCircle, label: t("navChat"), emoji: "💬" },
    { path: "/directory", icon: Store, label: t("navDirectory"), emoji: "📂" },
    ...(isBusiness ? [{ path: "/my-business", icon: Briefcase, label: t("navMyBusiness"), emoji: "🏪" }] : []),
    ...(isAdmin ? [{ path: "/admin", icon: Shield, label: t("navAdmin"), emoji: "🛡️" }] : []),
  ];

  return (
    <aside className="hidden md:flex flex-col w-56 border-r bg-sidebar text-sidebar-foreground min-h-screen">
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌙</span>
          <span className="font-heading font-bold text-lg">{t("appName")}</span>
        </Link>
        <p className="text-xs text-sidebar-foreground/60 mt-1">{t("tagline")}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <span className="text-base">{item.emoji}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
