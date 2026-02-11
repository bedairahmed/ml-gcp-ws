import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot, setDoc, serverTimestamp, getDoc, collection } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { ns } from "@/lib/namespace";
import type { UserProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isBusiness: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return unsubAuth;
  }, []);

  useEffect(() => {
    if (!user) return;

    const ensureUserDoc = async () => {
      const userRef = doc(db, ns("users"), user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          displayName: user.displayName || "User",
          email: user.email || "",
          role: "member",
          accountType: "community",
          groups: ["general"],
          language: "en",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
          lastSeen: serverTimestamp(),
          isActive: true,
          isOnline: true,
          businessIds: [],
        });
      }
    };

    ensureUserDoc().catch(console.error);

    const unsubProfile = onSnapshot(doc(db, ns("users"), user.uid), (snap) => {
      if (snap.exists()) {
        setProfile({ uid: user.uid, ...snap.data() } as UserProfile);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore profile listener error:", error.code, error.message);
      setLoading(false);
    });
    return unsubProfile;
  }, [user]);

  const isAdmin = profile?.role === "admin";
  const isModerator = profile?.role === "moderator";
  const isBusiness = profile?.role === "business";

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isModerator, isBusiness }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
