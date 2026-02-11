import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const EventsPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-4">📅 {t("navEvents")}</h1>
      <p className="text-muted-foreground">Events coming in Phase 5</p>
    </div>
  );
};

export default EventsPage;
