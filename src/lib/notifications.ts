import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { ns } from "@/lib/namespace";

export type NotificationType = "review" | "claim_approved" | "claim_rejected" | "announcement" | "claim_pending";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: any;
}

export const sendNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  link?: string
) => {
  try {
    await addDoc(collection(db, ns("notifications")), {
      userId,
      type,
      title,
      message,
      read: false,
      link: link || "",
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
};

/** Send to all admins — reads admin user docs and notifies each */
export const notifyAdmins = async (
  type: NotificationType,
  title: string,
  message: string,
  link?: string
) => {
  const { query, where, getDocs } = await import("firebase/firestore");
  try {
    const snap = await getDocs(query(collection(db, ns("users")), where("role", "==", "admin")));
    const promises = snap.docs.map((d) => sendNotification(d.id, type, title, message, link));
    await Promise.all(promises);
  } catch (err) {
    console.error("Failed to notify admins:", err);
  }
};
