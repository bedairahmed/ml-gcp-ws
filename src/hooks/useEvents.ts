import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { CommunityEvent, Announcement } from "@/types";
import { sampleEvents, sampleAnnouncements } from "@/data/sampleEvents";

export const useEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CommunityEvent[]>(sampleEvents);
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements);
  const [loading, setLoading] = useState(true);
  const [firestoreConnected, setFirestoreConnected] = useState(false);

  // Real-time events listener
  useEffect(() => {
    const q = query(
      collection(db, "events"),
      where("isActive", "==", true),
      orderBy("date", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const firestoreEvents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as CommunityEvent[];
          setEvents(firestoreEvents);
          setFirestoreConnected(true);
        }
        // If empty, keep sample data as fallback
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore events listener error, using sample data:", error.message);
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  // Real-time announcements listener
  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      where("active", "==", true),
      orderBy("priority", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const firestoreAnn = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Announcement[];
          setAnnouncements(firestoreAnn);
        }
      },
      (error) => {
        console.warn("Firestore announcements listener error, using sample data:", error.message);
      }
    );

    return unsub;
  }, []);

  // RSVP toggle — writes to Firestore if connected, otherwise local state
  const toggleRsvp = useCallback(
    async (eventId: string) => {
      if (!user) return;

      const event = events.find((e) => e.id === eventId);
      if (!event) return;
      const already = event.rsvpUsers.includes(user.uid);

      if (firestoreConnected) {
        try {
          const eventRef = doc(db, "events", eventId);
          await updateDoc(eventRef, {
            rsvpUsers: already ? arrayRemove(user.uid) : arrayUnion(user.uid),
            rsvpCount: increment(already ? -1 : 1),
          });
          toast.success(already ? "RSVP removed" : "RSVP confirmed! ✅");
        } catch (error: any) {
          console.error("RSVP toggle error:", error.message);
          toast.error("Failed to update RSVP");
        }
      } else {
        // Local fallback
        setEvents((prev) =>
          prev.map((evt) => {
            if (evt.id !== eventId) return evt;
            const rsvpUsers = already
              ? evt.rsvpUsers.filter((uid) => uid !== user.uid)
              : [...evt.rsvpUsers, user.uid];
            return { ...evt, rsvpUsers, rsvpCount: rsvpUsers.length };
          })
        );
        toast.success(already ? "RSVP removed" : "RSVP confirmed! ✅");
      }
    },
    [user, events, firestoreConnected]
  );

  return { events, announcements, loading, toggleRsvp };
};
