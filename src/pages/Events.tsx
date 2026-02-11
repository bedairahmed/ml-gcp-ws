import React, { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import AnnouncementBanner from "@/components/events/AnnouncementBanner";
import CategoryFilter, { type EventCategory } from "@/components/events/CategoryFilter";
import EventCard from "@/components/events/EventCard";
import AddEventDialog from "@/components/events/AddEventDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvents } from "@/hooks/useEvents";
import { isPast, parseISO } from "date-fns";

const EventsPage: React.FC = () => {
  const { t } = useLanguage();
  const { events, announcements, loading, toggleRsvp } = useEvents();
  const [category, setCategory] = useState<EventCategory>("all");

  const filtered = useMemo(() => {
    let list = events.filter((e) => e.isActive);
    if (category !== "all") list = list.filter((e) => e.category === category);
    return list;
  }, [events, category]);

  const upcoming = filtered
    .filter((e) => !isPast(parseISO(e.date)))
    .sort((a, b) => a.date.localeCompare(b.date));

  const past = filtered
    .filter((e) => isPast(parseISO(e.date)))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto flex items-center justify-center py-20">
        <p className="text-muted-foreground animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">📅 {t("navEvents")}</h1>
        <AddEventDialog />
      </div>

      <AnnouncementBanner announcements={announcements} />

      <CategoryFilter selected={category} onChange={setCategory} />

      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            🗓️ {t("upcoming")} ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            📜 {t("pastEvents")} ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {upcoming.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t("noResults")}</p>
          )}
          {upcoming.map((evt) => (
            <EventCard key={evt.id} event={evt} onRsvpToggle={toggleRsvp} />
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t("noResults")}</p>
          )}
          {past.map((evt) => (
            <EventCard key={evt.id} event={evt} onRsvpToggle={toggleRsvp} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsPage;
