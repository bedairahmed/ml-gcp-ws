import React, { useState, useMemo, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import AnnouncementBanner from "@/components/events/AnnouncementBanner";
import CategoryFilter, { type EventCategory } from "@/components/events/CategoryFilter";
import EventCard from "@/components/events/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleEvents, sampleAnnouncements } from "@/data/sampleEvents";
import { isPast, parseISO } from "date-fns";
import { toast } from "sonner";
import type { CommunityEvent } from "@/types";

const EventsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [category, setCategory] = useState<EventCategory>("all");
  const [events, setEvents] = useState<CommunityEvent[]>(sampleEvents);

  const handleRsvpToggle = useCallback(
    (eventId: string) => {
      if (!user) return;
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.id !== eventId) return evt;
          const already = evt.rsvpUsers.includes(user.uid);
          const rsvpUsers = already
            ? evt.rsvpUsers.filter((uid) => uid !== user.uid)
            : [...evt.rsvpUsers, user.uid];
          toast.success(already ? "RSVP removed" : "RSVP confirmed! ✅");
          return { ...evt, rsvpUsers };
        })
      );
    },
    [user]
  );

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

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="font-heading text-2xl font-bold">📅 {t("navEvents")}</h1>

      <AnnouncementBanner announcements={sampleAnnouncements} />

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
            <EventCard key={evt.id} event={evt} onRsvpToggle={handleRsvpToggle} />
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-3 mt-4">
          {past.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t("noResults")}</p>
          )}
          {past.map((evt) => (
            <EventCard key={evt.id} event={evt} onRsvpToggle={handleRsvpToggle} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsPage;
