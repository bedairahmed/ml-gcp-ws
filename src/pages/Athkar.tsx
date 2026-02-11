import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const AthkarPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-4">📿 {t("navAthkar")}</h1>
      <p className="text-muted-foreground">Athkar tracker coming in Phase 4</p>
    </div>
  );
};

export default AthkarPage;
