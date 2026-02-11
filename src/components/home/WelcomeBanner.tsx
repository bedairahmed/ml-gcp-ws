import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const WelcomeBanner: React.FC = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();

  const displayName = profile?.displayName || "User";
  const roleBadge = profile?.role
    ? { admin: "🛡️", moderator: "⭐", business: "🏪", member: "👤" }[profile.role]
    : "👤";

  return (
    <div className="islamic-pattern rounded-xl p-6 bg-primary/5 border border-primary/10">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="font-heading text-2xl font-bold text-primary">
          {t("welcomeGreeting")}, {displayName} 👋
        </h1>
        {profile?.role && (
          <Badge variant="secondary" className="text-xs">
            {roleBadge} {t(`role${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}`)}
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground mt-1">{t("tagline")}</p>
    </div>
  );
};

export default WelcomeBanner;
