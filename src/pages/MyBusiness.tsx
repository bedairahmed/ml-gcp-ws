import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const MyBusinessPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-4">🏪 {t("navMyBusiness")}</h1>
      <p className="text-muted-foreground">Business dashboard coming in Phase 7</p>
    </div>
  );
};

export default MyBusinessPage;
