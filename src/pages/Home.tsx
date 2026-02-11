import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <div className="islamic-pattern rounded-xl p-6 bg-primary/5 border border-primary/10">
        <h1 className="font-heading text-2xl font-bold text-primary">
          {t("welcomeGreeting")} 👋
        </h1>
        <p className="text-muted-foreground mt-1">{t("tagline")}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-heading font-semibold text-lg mb-2">🕌 {t("nextPrayer")}</h2>
          <p className="text-muted-foreground text-sm">Prayer times widget coming in Phase 3</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-heading font-semibold text-lg mb-2">🌤️ Weather</h2>
          <p className="text-muted-foreground text-sm">Weather widget coming in Phase 3</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
