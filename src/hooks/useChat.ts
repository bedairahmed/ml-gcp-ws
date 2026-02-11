import { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { ns } from "@/lib/namespace";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { ChatMessage, Group, UserProfile } from "@/types";
import { sampleGroups, sampleMessages } from "@/data/sampleChat";

export const useChat = (activeGroupId: string) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
  const [groups, setGroups] = useState<Group[]>(sampleGroups);
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [firestoreConnected, setFirestoreConnected] = useState(false);

  // Fetch all active users for @mention
  useEffect(() => {
    const q = query(collection(db, ns("users")), where("isActive", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      setMembers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile)));
    }, () => {});
    return unsub;
  }, []);

  // Real-time groups listener
  useEffect(() => {
    const q = query(collection(db, ns("groups")), orderBy("name_en", "asc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const firestoreGroups = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Group[];
          setGroups(firestoreGroups);
        }
      },
      (error) => {
        console.warn("Firestore groups listener error, using sample data:", error.message);
      }
    );
    return unsub;
  }, []);

  // Real-time messages listener for active group
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, ns("messages")),
      where("groupId", "==", activeGroupId),
      orderBy("timestamp", "asc"),
      limit(100)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const firestoreMsgs = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as ChatMessage[];
          setMessages(firestoreMsgs);
          setFirestoreConnected(true);
        } else if (!firestoreConnected) {
          // Keep sample data for the "general" group as fallback
          setMessages(
            activeGroupId === "general" ? sampleMessages : []
          );
        } else {
          setMessages([]);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore messages listener error, using sample data:", error.message);
        if (!firestoreConnected) {
          setMessages(activeGroupId === "general" ? sampleMessages : []);
        }
        setLoading(false);
      }
    );

    return unsub;
  }, [activeGroupId, firestoreConnected]);

  // Send message
  const sendMessage = useCallback(
    async (text: string, replyTo?: ChatMessage | null) => {
      if (!user || !profile) return;

      // Input validation
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > 2000) {
        toast.error(trimmed.length > 2000 ? "Message too long (max 2000 chars)" : "Message cannot be empty");
        return;
      }
      // Extract @mentions from text
      const mentionMatches = text.match(/@[\w\s]+?\b/g) || [];
      const mentionedNames = mentionMatches.map((m) => m.slice(1).trim());
      const mentionedUids = members
        .filter((m) => mentionedNames.some((n) => m.displayName.toLowerCase() === n.toLowerCase()))
        .map((m) => m.uid);

      const msgData: Omit<ChatMessage, "id"> = {
        displayName: profile.displayName,
        message: text,
        timestamp: serverTimestamp() as any,
        userId: user.uid,
        groupId: activeGroupId,
        textDirection: /[\u0600-\u06FF]/.test(text) ? "rtl" : "ltr",
        isDeleted: false,
        messageType: "text",
        mentions: mentionedUids,
        reactions: {},
        replyTo: replyTo
          ? {
              messageId: replyTo.id,
              displayName: replyTo.displayName,
              messagePreview: replyTo.message.slice(0, 50),
            }
          : null,
      };

      if (firestoreConnected) {
        try {
          await addDoc(collection(db, ns("messages")), msgData);
        } catch (error: any) {
          console.error("Send message error:", error.message);
          toast.error("Failed to send message");
        }
      } else {
        // Local fallback
        const localMsg: ChatMessage = {
          ...msgData,
          id: `msg-${Date.now()}`,
          timestamp: { toMillis: () => Date.now() } as any,
        };
        setMessages((prev) => [...prev, localMsg]);
      }
    },
    [user, profile, activeGroupId, firestoreConnected]
  );

  // Toggle reaction
  const toggleReaction = useCallback(
    async (msgId: string, emoji: string) => {
      if (!user) return;

      if (firestoreConnected) {
        try {
          const msgRef = doc(db, ns("messages"), msgId);
          const msg = messages.find((m) => m.id === msgId);
          if (!msg) return;
          const users = msg.reactions?.[emoji] || [];
          const already = users.includes(user.uid);

          // Firestore doesn't support nested array ops on map fields easily,
          // so we rebuild the reactions map
          const newReactions = { ...msg.reactions };
          if (already) {
            newReactions[emoji] = users.filter((u: string) => u !== user.uid);
            if (newReactions[emoji].length === 0) delete newReactions[emoji];
          } else {
            newReactions[emoji] = [...users, user.uid];
          }
          await updateDoc(msgRef, { reactions: newReactions });
        } catch (error: any) {
          console.error("Reaction error:", error.message);
        }
      } else {
        // Local fallback
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== msgId) return m;
            const reactions = { ...m.reactions };
            const users = reactions[emoji] ? [...reactions[emoji]] : [];
            if (users.includes(user.uid)) {
              reactions[emoji] = users.filter((u) => u !== user.uid);
              if (reactions[emoji].length === 0) delete reactions[emoji];
            } else {
              reactions[emoji] = [...users, user.uid];
            }
            return { ...m, reactions };
          })
        );
      }
    },
    [user, messages, firestoreConnected]
  );

  return { messages, groups, members, loading, sendMessage, toggleReaction };
};
