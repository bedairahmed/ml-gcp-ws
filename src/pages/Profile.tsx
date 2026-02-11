import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-4">👤 {t("navProfile")}</h1>
      <p className="text-muted-foreground">Profile page coming in Phase 2</p>
    </div>
  );
};

export default ProfilePage;
