import { useState, useEffect } from "react";
import {
  collection, query, onSnapshot, doc, updateDoc, deleteDoc,
  addDoc, serverTimestamp, orderBy, where, getDocs
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { ns } from "@/lib/namespace";
import type { UserProfile, CommunityEvent, BusinessClaim, Announcement } from "@/types";
import { sendNotification } from "@/lib/notifications";

export const useAdmin = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [claims, setClaims] = useState<BusinessClaim[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // Users
    unsubs.push(
      onSnapshot(collection(db, ns("users")), (snap) => {
        setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserProfile)));
        setLoading(false);
      }, (err) => { console.error("Admin users error:", err); setLoading(false); })
    );

    // Events
    unsubs.push(
      onSnapshot(query(collection(db, ns("events")), orderBy("createdAt", "desc")), (snap) => {
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityEvent)));
      }, (err) => console.error("Admin events error:", err))
    );

    // Business Claims
    unsubs.push(
      onSnapshot(query(collection(db, ns("businessClaims")), orderBy("createdAt", "desc")), (snap) => {
        setClaims(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BusinessClaim)));
      }, (err) => console.error("Admin claims error:", err))
    );

    // Announcements
    unsubs.push(
      onSnapshot(query(collection(db, ns("announcements")), orderBy("priority", "desc")), (snap) => {
        setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement)));
      }, (err) => console.error("Admin announcements error:", err))
    );

    return () => unsubs.forEach((u) => u());
  }, []);

  const updateUserRole = async (uid: string, role: string) => {
    await updateDoc(doc(db, ns("users"), uid), { role });
  };

  const toggleUserActive = async (uid: string, isActive: boolean) => {
    await updateDoc(doc(db, ns("users"), uid), { isActive });
  };

  const toggleEventActive = async (eventId: string, isActive: boolean) => {
    await updateDoc(doc(db, ns("events"), eventId), { isActive });
  };

  const deleteEvent = async (eventId: string) => {
    await deleteDoc(doc(db, ns("events"), eventId));
  };

  const approveClaim = async (claim: BusinessClaim, reviewerUid: string) => {
    await updateDoc(doc(db, ns("businessClaims"), claim.id), {
      status: "approved",
      reviewedBy: reviewerUid,
      reviewedAt: serverTimestamp(),
    });
    // Update the business document
    const bizQuery = query(collection(db, ns("businesses")), where("__name__", "==", claim.businessId));
    const bizSnap = await getDocs(bizQuery);
    if (!bizSnap.empty) {
      await updateDoc(bizSnap.docs[0].ref, {
        isClaimed: true,
        claimedBy: claim.userId,
        claimStatus: "approved",
        isVerified: true,
        ownerUid: claim.userId,
      });
    }
    // Notify the claimant
    await sendNotification(claim.userId, "claim_approved", "Claim Approved! ✅", `Your claim for "${claim.businessName}" has been approved.`, "/my-business");
  };

  const rejectClaim = async (claimId: string, reviewerUid: string) => {
    const claim = claims.find((c) => c.id === claimId);
    await updateDoc(doc(db, ns("businessClaims"), claimId), {
      status: "rejected",
      reviewedBy: reviewerUid,
      reviewedAt: serverTimestamp(),
    });
    if (claim) {
      await sendNotification(claim.userId, "claim_rejected", "Claim Rejected", `Your claim for "${claim.businessName}" was not approved.`, "/directory");
    }
  };

  const createAnnouncement = async (data: Omit<Announcement, "id" | "createdAt">) => {
    await addDoc(collection(db, ns("announcements")), {
      ...data,
      createdAt: serverTimestamp(),
    });
    // Notify all active users
    try {
      const activeUsers = await getDocs(query(collection(db, ns("users")), where("isActive", "==", true)));
      const promises = activeUsers.docs.map((d) =>
        sendNotification(d.id, "announcement", "📢 New Announcement", data.text_en, "/")
      );
      await Promise.all(promises);
    } catch (err) {
      console.error("Failed to notify users about announcement:", err);
    }
  };

  const updateAnnouncement = async (id: string, data: Partial<Announcement>) => {
    await updateDoc(doc(db, ns("announcements"), id), data);
  };

  const deleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(db, ns("announcements"), id));
  };

  return {
    users, events, claims, announcements, loading,
    updateUserRole, toggleUserActive,
    toggleEventActive, deleteEvent,
    approveClaim, rejectClaim,
    createAnnouncement, updateAnnouncement, deleteAnnouncement,
  };
};
