import { useState, useEffect } from "react";
import {
  collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, where, getDocs,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { sampleBusinesses, sampleReviews } from "@/data/sampleBusinesses";
import type { Business, BusinessReview } from "@/types";
import { sendNotification, notifyAdmins } from "@/lib/notifications";

export const useDirectory = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [reviewsMap, setReviewsMap] = useState<Record<string, BusinessReview[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "businesses"), orderBy("createdAt", "desc")),
      (snap) => {
        if (!snap.empty) {
          setBusinesses(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Business)));
        } else {
          setBusinesses(sampleBusinesses);
        }
        setLoading(false);
      },
      () => {
        setBusinesses(sampleBusinesses);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  // Listen reviews for each business
  useEffect(() => {
    if (businesses.length === 0) return;
    const unsubs: (() => void)[] = [];

    businesses.forEach((biz) => {
      const unsub = onSnapshot(
        query(collection(db, "businesses", biz.id, "reviews"), orderBy("createdAt", "desc")),
        (snap) => {
          if (!snap.empty) {
            setReviewsMap((prev) => ({
              ...prev,
              [biz.id]: snap.docs.map((d) => ({ id: d.id, ...d.data() } as BusinessReview)),
            }));
          } else if (sampleReviews[biz.id]) {
            setReviewsMap((prev) => ({ ...prev, [biz.id]: sampleReviews[biz.id] }));
          }
        },
        () => {
          if (sampleReviews[biz.id]) {
            setReviewsMap((prev) => ({ ...prev, [biz.id]: sampleReviews[biz.id] }));
          }
        }
      );
      unsubs.push(unsub);
    });

    return () => unsubs.forEach((u) => u());
  }, [businesses]);

  const submitClaim = async (businessId: string, businessName: string, userId: string, userName: string, userEmail: string) => {
    await addDoc(collection(db, "businessClaims"), {
      businessId, businessName, userId, userName, userEmail,
      verificationMethod: "email",
      verificationDetails: userEmail,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    // Notify admins about new claim
    await notifyAdmins("claim_pending", "New Business Claim 📋", `${userName} wants to claim "${businessName}".`, "/admin");
  };

  const submitReview = async (businessId: string, review: Omit<BusinessReview, "id" | "createdAt" | "updatedAt">) => {
    await addDoc(collection(db, "businesses", businessId, "reviews"), {
      ...review,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    // Notify business owner about new review
    const biz = businesses.find((b) => b.id === businessId);
    if (biz?.ownerUid) {
      await sendNotification(biz.ownerUid, "review", "New Review ⭐", `${review.userName} left a ${review.rating}-star review.`, "/my-business");
    }
  };

  return { businesses, reviewsMap, loading, submitClaim, submitReview };
};
