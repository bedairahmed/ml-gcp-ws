import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users, Check } from "lucide-react";
import type { CommunityEvent, Language } from "@/types";
import { format, parseISO, isPast } from "date-fns";

const getTitle = (e: CommunityEvent, lang: Language) =>
  lang === "ar" ? e.title_ar : lang === "ur" ? e.title_ur : e.title_en;

const getDesc = (e: CommunityEvent, lang: Language) =>
  lang === "ar" ? e.description_ar : lang === "ur" ? e.description_ur : e.description_en;

const categoryColors: Record<string, string> = {
  jummah: "bg-primary/15 text-primary border-primary/30",
  education: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  social: "bg-secondary/15 text-secondary border-secondary/30",
  youth: "bg-accent/15 text-accent border-accent/30",
  volunteer: "bg-success/15 text-success border-success/30",
  ramadan: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
};

interface Props {
  event: CommunityEvent;
  onRsvpToggle: (eventId: string) => void;
}

const EventCard: React.FC<Props> = ({ event, onRsvpToggle }) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const isRsvpd = user ? event.rsvpUsers.includes(user.uid) : false;
  const past = isPast(parseISO(event.date));

  return (
    <Card className={`transition-all hover:shadow-md ${past ? "opacity-60" : ""}`}>
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <h3 className="font-heading font-semibold text-lg leading-tight truncate">
              {getTitle(event, language)}
            </h3>
            <Badge variant="outline" className={`text-xs ${categoryColors[event.category] || ""}`}>
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </Badge>
          </div>
          <Button
            variant={isRsvpd ? "default" : "outline"}
            size="sm"
            disabled={past}
            onClick={() => onRsvpToggle(event.id)}
            className="shrink-0 gap-1.5"
          >
            {isRsvpd ? <Check className="w-3.5 h-3.5" /> : null}
            {isRsvpd ? t("rsvpd") : t("rsvp")}
          </Button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {getDesc(event, language)}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {format(parseISO(event.date), "EEE, MMM d")}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {event.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {event.rsvpCount + (isRsvpd ? 1 : 0)} {t("rsvpd")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
