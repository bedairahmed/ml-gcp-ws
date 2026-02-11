import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Calendar, MessageCircle, Store, Shield, Briefcase } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin, isBusiness } = useAuth();
  const location = useLocation();

  const baseItems = [
    { path: "/", icon: Home, label: t("navHome"), emoji: "🏠" },
    { path: "/athkar", icon: BookOpen, label: t("navAthkar"), emoji: "📿" },
    { path: "/events", icon: Calendar, label: t("navEvents"), emoji: "📅" },
    { path: "/chat", icon: MessageCircle, label: t("navChat"), emoji: "💬" },
    { path: "/directory", icon: Store, label: t("navDirectory"), emoji: "📂" },
  ];

  const conditionalItems = [
    ...(isBusiness ? [{ path: "/my-business", icon: Briefcase, label: t("navMyBusiness"), emoji: "🏪" }] : []),
    ...(isAdmin ? [{ path: "/admin", icon: Shield, label: t("navAdmin"), emoji: "🛡️" }] : []),
  ];

  const items = [...baseItems, ...conditionalItems];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden">
      <div className="flex items-center justify-around h-16 px-1">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-lg leading-none">{item.emoji}</span>
              <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
