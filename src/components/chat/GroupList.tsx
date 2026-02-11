import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Group, Language } from "@/types";

const getGroupName = (g: Group, lang: Language) =>
  lang === "ar" ? g.name_ar : lang === "ur" ? g.name_ur : g.name_en;

interface Props {
  groups: Group[];
  activeGroupId: string;
  onSelect: (id: string) => void;
  unreadCounts?: Record<string, number>;
}

const GroupList: React.FC<Props> = ({ groups, activeGroupId, onSelect, unreadCounts = {} }) => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          Channels
        </h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {groups.map((group) => {
            const isActive = group.id === activeGroupId;
            const unread = unreadCounts[group.id] || 0;

            return (
              <button
                key={group.id}
                onClick={() => onSelect(group.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-foreground/80"
                }`}
              >
                <span className="text-lg">{group.icon}</span>
                <span className="flex-1 truncate text-sm">{getGroupName(group, language)}</span>
                {unread > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unread}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{group.memberCount}</span>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default GroupList;
