import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import type { Language } from "@/types";
import { getLanguageLabel } from "@/data/translations";

const languages: Language[] = ["en", "ar", "ur"];

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const { profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-14 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🌙</span>
          <span className="font-heading font-bold text-lg text-primary">{t("appName")}</span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          {/* Language switcher */}
          <div className="flex items-center rounded-lg bg-muted p-0.5 text-xs">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-md transition-colors font-medium ${
                  language === lang
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {getLanguageLabel(lang)}
              </button>
            ))}
          </div>

          {/* Dark mode */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={t("darkMode")}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Profile */}
          {profile && (
            <Link to="/profile" className="p-1">
              <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {profile.displayName?.charAt(0)?.toUpperCase() || "?"}
              </div>
            </Link>
          )}

          {/* About */}
          <Link to="/about" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Info className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
