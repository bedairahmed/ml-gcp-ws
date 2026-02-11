import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export type EventCategory = "all" | "jummah" | "education" | "social" | "youth" | "volunteer" | "ramadan";

const categoryConfig: Record<EventCategory, { emoji: string; en: string; ar: string; ur: string }> = {
  all:       { emoji: "📋", en: "All",        ar: "الكل",       ur: "سب" },
  jummah:    { emoji: "🕌", en: "Jummah",     ar: "الجمعة",     ur: "جمعہ" },
  education: { emoji: "📖", en: "Education",  ar: "التعليم",    ur: "تعلیم" },
  social:    { emoji: "🤝", en: "Social",     ar: "اجتماعي",    ur: "سماجی" },
  youth:     { emoji: "⚡", en: "Youth",      ar: "الشباب",     ur: "نوجوان" },
  volunteer: { emoji: "💚", en: "Volunteer",  ar: "تطوع",       ur: "رضاکارانہ" },
  ramadan:   { emoji: "🌙", en: "Ramadan",    ar: "رمضان",      ur: "رمضان" },
};

interface Props {
  selected: EventCategory;
  onChange: (cat: EventCategory) => void;
}

const CategoryFilter: React.FC<Props> = ({ selected, onChange }) => {
  const { language } = useLanguage();

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        {(Object.keys(categoryConfig) as EventCategory[]).map((cat) => {
          const cfg = categoryConfig[cat];
          const label = language === "ar" ? cfg.ar : language === "ur" ? cfg.ur : cfg.en;
          const isActive = selected === cat;

          return (
            <Button
              key={cat}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(cat)}
              className="shrink-0 gap-1.5"
            >
              <span>{cfg.emoji}</span>
              <span>{label}</span>
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryFilter;
