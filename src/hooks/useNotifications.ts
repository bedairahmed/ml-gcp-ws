import { useState, useEffect } from "react";
import {
  collection, query, where, orderBy, onSnapshot, doc, updateDoc, writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { AppNotification } from "@/lib/notifications";

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setNotifications([]); setLoading(false); return; }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification)));
      setLoading(false);
    }, (err) => {
      console.error("Notifications listener error:", err);
      setLoading(false);
    });

    return unsub;
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (notifId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notifId), { read: true });
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      notifications.filter((n) => !n.read).forEach((n) => {
        batch.update(doc(db, "notifications", n.id), { read: true });
      });
      await batch.commit();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
};
