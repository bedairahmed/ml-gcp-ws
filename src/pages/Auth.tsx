import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { ns } from "@/lib/namespace";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { Language, AccountType } from "@/types";
import { getLanguageLabel } from "@/data/translations";
import { toast } from "sonner";

const languages: Language[] = ["en", "ar", "ur"];

const AuthPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("community");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createUserDocument = async (
    uid: string,
    name: string,
    userEmail: string,
    type: AccountType
  ) => {
    const userRef = doc(db, ns("users"), uid);
    const existing = await getDoc(userRef);
    if (existing.exists()) return;

    await setDoc(userRef, {
      displayName: name,
      email: userEmail,
      role: type === "business_owner" ? "business" : "member",
      accountType: type,
      groups: ["general"],
      language,
      photoURL: "",
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      isActive: true,
      isOnline: true,
      businessIds: [],
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (tab === "register") {
      if (!displayName.trim()) {
        setError(t("errorNameRequired"));
        return;
      }
      if (password.length < 6) {
        setError(t("errorPasswordShort"));
        return;
      }
      if (password !== confirmPassword) {
        setError(t("errorPasswordMismatch"));
        return;
      }
    }

    setLoading(true);
    try {
      if (tab === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName });
        await createUserDocument(cred.user.uid, displayName, email, accountType);
        toast.success(t("registerSuccess"));
        if (accountType === "business_owner") {
          navigate("/my-business");
        } else {
          navigate("/");
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success(t("signInSuccess"));
        navigate("/");
      }
    } catch (err: any) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") setError(t("errorEmailInUse"));
      else if (code === "auth/invalid-email") setError(t("errorInvalidEmail"));
      else if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential")
        setError(t("errorInvalidCredentials"));
      else setError(err.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      await createUserDocument(
        cred.user.uid,
        cred.user.displayName || "User",
        cred.user.email || "",
        "community"
      );
      toast.success(t("signInSuccess"));
      navigate("/");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || t("error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError(t("errorEmailRequired"));
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(t("resetEmailSent"));
    } catch {
      setError(t("errorResetFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 islamic-pattern bg-background">
      <div className="w-full max-w-md">
        {/* Language / theme bar */}
        <div className="flex items-center justify-between mb-6">
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
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Card */}
        <form onSubmit={handleEmailAuth} className="rounded-xl border bg-card shadow-lg p-6 space-y-6">
          {/* Title */}
          <div className="text-center space-y-1">
            <span className="text-4xl">🌙</span>
            <h1 className="font-heading text-2xl font-bold text-primary">{t("appName")}</h1>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => { setTab("signin"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === "signin" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("signIn")}
            </button>
            <button
              type="button"
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === "register" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("register")}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          {/* Form fields */}
          <div className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="text-sm font-medium">{t("displayName")}</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                  placeholder={t("displayName")}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium">{t("email")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                placeholder={t("email")}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                placeholder={t("password")}
                required
              />
            </div>
            {tab === "register" && (
              <>
                <div>
                  <label className="text-sm font-medium">{t("confirmPassword")}</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    placeholder={t("confirmPassword")}
                  />
                </div>
                {/* Account type selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("accountType")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType("community")}
                      className={`p-3 rounded-lg border-2 text-left space-y-1 transition-colors ${
                        accountType === "community"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-lg">👤</span>
                      <p className="text-xs font-medium">{t("communityMember")}</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType("business_owner")}
                      className={`p-3 rounded-lg border-2 text-left space-y-1 transition-colors ${
                        accountType === "business_owner"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-lg">🏪</span>
                      <p className="text-xs font-medium">{t("businessOwner")}</p>
                    </button>
                  </div>
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? t("loading") : tab === "signin" ? t("signIn") : t("register")}
            </button>
            {tab === "signin" && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full text-xs text-primary hover:underline"
              >
                {t("forgotPassword")}
              </button>
            )}
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
            </div>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-10 rounded-lg border bg-card text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {t("signInWithGoogle")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
