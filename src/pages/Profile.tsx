import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { Language } from "@/types";
import { getLanguageLabel } from "@/data/translations";
import { toast } from "sonner";

const languages: Language[] = ["en", "ar", "ur"];

const roleBadge: Record<string, { emoji: string; color: string }> = {
  admin: { emoji: "🛡️", color: "bg-destructive/10 text-destructive" },
  moderator: { emoji: "⭐", color: "bg-secondary/10 text-secondary" },
  business: { emoji: "🏪", color: "bg-accent/10 text-accent" },
  member: { emoji: "👤", color: "bg-primary/10 text-primary" },
};

const ProfilePage: React.FC = () => {
  const { user, profile, isAdmin, isBusiness } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(profile?.displayName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user || !newName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: newName });
      await updateDoc(doc(db, "users", user.uid), {
        displayName: newName,
        lastSeen: serverTimestamp(),
      });
      toast.success(t("save"));
      setEditing(false);
    } catch {
      toast.error(t("error"));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/auth");
  };

  const handleUpgradeToBusiness = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        role: "business",
        accountType: "business_owner",
      });
      toast.success(t("upgradedToBusiness"));
      navigate("/my-business");
    } catch {
      toast.error(t("error"));
    }
  };

  if (!profile) {
    return (
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        <h1 className="font-heading text-2xl font-bold">👤 {t("navProfile")}</h1>
        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground">
          <p>{t("loading")}...</p>
          <p className="text-xs mt-2">{t("error")}: If this persists, check Firestore Security Rules.</p>
        </div>
      </div>
    );
  }

  const badge = roleBadge[profile.role] || roleBadge.member;
  const memberSince = profile.createdAt?.toDate
    ? profile.createdAt.toDate().toLocaleDateString()
    : "—";

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <h1 className="font-heading text-2xl font-bold">👤 {t("navProfile")}</h1>

      {/* Avatar & name */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
            {profile.displayName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 space-y-1">
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm"
                />
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                >
                  {t("save")}
                </button>
                <button
                  onClick={() => { setEditing(false); setNewName(profile.displayName); }}
                  className="px-3 h-9 rounded-lg border text-sm"
                >
                  {t("cancel")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{profile.displayName}</h2>
                <button onClick={() => setEditing(true)} className="text-xs text-primary hover:underline">
                  {t("edit")}
                </button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.emoji} {t(`role${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}`)}
            </span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          {t("memberSince")}: {memberSince}
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <h3 className="font-heading font-semibold">{t("preferences")}</h3>

        {/* Language */}
        <div className="flex items-center justify-between">
          <span className="text-sm">{t("language")}</span>
          <div className="flex items-center rounded-lg bg-muted p-0.5 text-xs">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-md transition-colors font-medium ${
                  language === lang ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {getLanguageLabel(lang)}
              </button>
            ))}
          </div>
        </div>

        {/* Dark mode */}
        <div className="flex items-center justify-between">
          <span className="text-sm">{t("darkMode")}</span>
          <button
            onClick={toggleTheme}
            className={`relative w-11 h-6 rounded-full transition-colors ${isDark ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${isDark ? "translate-x-5" : ""}`} />
          </button>
        </div>
      </div>

      {/* Groups */}
      <div className="rounded-xl border bg-card p-6 space-y-3">
        <h3 className="font-heading font-semibold">{t("groups")}</h3>
        <div className="flex flex-wrap gap-2">
          {profile.groups?.map((g) => (
            <span key={g} className="px-3 py-1 rounded-full bg-muted text-sm">{g}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        {profile.role === "member" && (
          <button
            onClick={handleUpgradeToBusiness}
            className="w-full h-10 rounded-lg border-2 border-accent text-accent font-medium text-sm hover:bg-accent/5 transition-colors"
          >
            🏪 {t("upgradeToBusiness")}
          </button>
        )}
        {isBusiness && (
          <button
            onClick={() => navigate("/my-business")}
            className="w-full h-10 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
          >
            🏪 {t("navMyBusiness")}
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="w-full h-10 rounded-lg border text-sm font-medium hover:bg-muted transition-colors"
          >
            🛡️ {t("navAdmin")}
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full h-10 rounded-lg bg-destructive text-destructive-foreground font-medium text-sm hover:bg-destructive/90 transition-colors"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
