import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { Language } from "@/types";
import { getLanguageLabel } from "@/data/translations";

const languages: Language[] = ["en", "ar", "ur"];

const AuthPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const [tab, setTab] = useState<"signin" | "register">("signin");

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
        <div className="rounded-xl border bg-card shadow-lg p-6 space-y-6">
          {/* Title */}
          <div className="text-center space-y-1">
            <span className="text-4xl">🌙</span>
            <h1 className="font-heading text-2xl font-bold text-primary">{t("appName")}</h1>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setTab("signin")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === "signin" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("signIn")}
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                tab === "register" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("register")}
            </button>
          </div>

          {/* Placeholder form */}
          <div className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="text-sm font-medium">{t("displayName")}</label>
                <input className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder={t("displayName")} />
              </div>
            )}
            <div>
              <label className="text-sm font-medium">{t("email")}</label>
              <input type="email" className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder={t("email")} />
            </div>
            <div>
              <label className="text-sm font-medium">{t("password")}</label>
              <input type="password" className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder={t("password")} />
            </div>
            {tab === "register" && (
              <>
                <div>
                  <label className="text-sm font-medium">{t("confirmPassword")}</label>
                  <input type="password" className="mt-1 flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm" placeholder={t("confirmPassword")} />
                </div>
                {/* Account type selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("accountType")}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-3 rounded-lg border-2 border-primary bg-primary/5 text-left space-y-1">
                      <span className="text-lg">👤</span>
                      <p className="text-xs font-medium">{t("communityMember")}</p>
                    </button>
                    <button className="p-3 rounded-lg border-2 border-border text-left space-y-1 hover:border-primary/50 transition-colors">
                      <span className="text-lg">🏪</span>
                      <p className="text-xs font-medium">{t("businessOwner")}</p>
                    </button>
                  </div>
                </div>
              </>
            )}
            <button className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
              {tab === "signin" ? t("signIn") : t("register")}
            </button>
            {tab === "signin" && (
              <button className="w-full text-xs text-primary hover:underline">{t("forgotPassword")}</button>
            )}
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
            </div>
            <button className="w-full h-10 rounded-lg border bg-card text-sm font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {t("signInWithGoogle")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
