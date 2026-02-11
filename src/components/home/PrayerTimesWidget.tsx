import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface PrayerTime {
  name: string;
  key: string;
  time: string;
  date: Date;
}

interface HijriDate {
  day: string;
  month: { en: string; ar: string };
  year: string;
  designation: { abbreviated: string };
}

const CANTON_MI = { lat: 42.3087, lng: -83.4821 };
const METHOD = 2; // ISNA

const PrayerTimesWidget: React.FC = () => {
  const { t } = useLanguage();
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const parsePrayerTime = useCallback((timeStr: string): Date => {
    const [time] = timeStr.split(" (");
    const [hours, minutes] = time.split(":").map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
  }, []);

  useEffect(() => {
    const fetchPrayers = async () => {
      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${CANTON_MI.lat}&longitude=${CANTON_MI.lng}&method=${METHOD}`
        );
        const data = await res.json();
        const timings = data.data.timings;
        setHijriDate(data.data.date.hijri);

        const prayerKeys = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
        const mapped: PrayerTime[] = prayerKeys.map((key) => ({
          name: key,
          key: key.toLowerCase(),
          time: timings[key],
          date: parsePrayerTime(timings[key]),
        }));
        setPrayers(mapped);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchPrayers();

    // Auto-refresh at midnight
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 10);
    const msUntilMidnight = midnight.getTime() - now.getTime();
    const timer = setTimeout(fetchPrayers, msUntilMidnight);
    return () => clearTimeout(timer);
  }, [parsePrayerTime]);

  // Determine next prayer & countdown
  useEffect(() => {
    if (prayers.length === 0) return;

    const updateNext = () => {
      const now = new Date();
      // Skip Sunrise for "next prayer" calculation
      const actual = prayers.filter((p) => p.key !== "sunrise");
      const next = actual.find((p) => p.date > now);
      setNextPrayer(next || actual[0]); // wrap to Fajr tomorrow

      if (next) {
        const diff = next.date.getTime() - now.getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`);
      } else {
        setCountdown("");
      }
    };

    updateNext();
    const interval = setInterval(updateNext, 1000);
    return () => clearInterval(interval);
  }, [prayers]);

  const formatTime12h = (timeStr: string) => {
    const [time] = timeStr.split(" (");
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const h12 = hours % 12 || 12;
    return `${h12}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle><Skeleton className="h-6 w-40" /></CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle>🕌 {t("nextPrayer")}</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{t("error")}</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-primary/5">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>🕌 {t("nextPrayer")}</span>
          <span className="text-xs font-normal text-muted-foreground">Canton, MI</span>
        </CardTitle>
        {hijriDate && (
          <p className="text-xs text-muted-foreground">
            {hijriDate.day} {hijriDate.month.en} {hijriDate.year} {hijriDate.designation.abbreviated}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-4 space-y-1.5">
        {prayers.map((prayer) => {
          const isNext = nextPrayer?.key === prayer.key;
          return (
            <div
              key={prayer.key}
              className={`flex items-center justify-between rounded-lg px-3 py-2 transition-all ${
                isNext
                  ? "bg-primary/10 border border-primary/30 shadow-sm animate-pulse"
                  : "hover:bg-muted/50"
              }`}
            >
              <span className={`font-medium text-sm ${isNext ? "text-primary font-semibold" : ""}`}>
                {t(prayer.key)}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-sm tabular-nums ${isNext ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {formatTime12h(prayer.time)}
                </span>
                {isNext && countdown && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full tabular-nums">
                    {countdown}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default PrayerTimesWidget;
