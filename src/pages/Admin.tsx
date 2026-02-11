import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-4">🛡️ {t("navAdmin")}</h1>
      <p className="text-muted-foreground">Admin dashboard coming in Phase 8</p>
    </div>
  );
};

export default AdminPage;
