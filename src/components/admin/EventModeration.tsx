import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar, MapPin, Trash2, Users } from "lucide-react";
import type { CommunityEvent } from "@/types";

interface Props {
  events: CommunityEvent[];
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

const EventModeration: React.FC<Props> = ({ events, onToggleActive, onDelete }) => {
  const { t, language } = useLanguage();

  const getTitle = (e: CommunityEvent) =>
    language === "ar" ? e.title_ar || e.title_en : language === "ur" ? e.title_ur || e.title_en : e.title_en;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{events.length} events total</p>
      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{getTitle(event)}</h3>
                <Badge variant={event.isActive ? "default" : "outline"} className="text-[10px]">
                  {event.isActive ? "Active" : "Hidden"}
                </Badge>
                <Badge variant="secondary" className="text-[10px]">{event.category}</Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{event.date} {event.time}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.rsvpCount} RSVPs</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Switch checked={event.isActive} onCheckedChange={(v) => onToggleActive(event.id, v)} />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(event.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">{t("noResults")}</p>}
      </div>
    </div>
  );
};

export default EventModeration;
