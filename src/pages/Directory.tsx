import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const DirectoryPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-4">📂 {t("navDirectory")}</h1>
      <p className="text-muted-foreground">Business directory coming in Phase 7</p>
    </div>
  );
};

export default DirectoryPage;
