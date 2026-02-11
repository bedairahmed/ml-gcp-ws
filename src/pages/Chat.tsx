import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ChatPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="font-heading text-2xl font-bold mb-4">💬 {t("navChat")}</h1>
      <p className="text-muted-foreground">Chat coming in Phase 6</p>
    </div>
  );
};

export default ChatPage;
