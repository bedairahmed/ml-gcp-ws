import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Announcement, Language } from "@/types";
import { Megaphone } from "lucide-react";

const getAnnouncementText = (a: Announcement, lang: Language) => {
  if (lang === "ar") return a.text_ar;
  if (lang === "ur") return a.text_ur;
  return a.text_en;
};

interface Props {
  announcements: Announcement[];
}

const AnnouncementBanner: React.FC<Props> = ({ announcements }) => {
  const { language } = useLanguage();
  const active = announcements.filter((a) => a.active).sort((a, b) => a.priority - b.priority);

  if (active.length === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-start gap-3">
      <Megaphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <div className="space-y-1">
        {active.map((a) => (
          <p key={a.id} className="text-sm font-medium text-foreground">
            {getAnnouncementText(a, language)}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBanner;
