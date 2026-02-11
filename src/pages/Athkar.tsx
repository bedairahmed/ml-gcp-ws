import React, { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getMorningAthkar, getEveningAthkar, type AthkarItem } from "@/data/athkar";
import { Check, RotateCcw, Flame } from "lucide-react";

const STREAK_KEY = "madina-lab-athkar-streak";
const LAST_DATE_KEY = "madina-lab-athkar-last-date";

const getStreak = (): number => {
  return parseInt(localStorage.getItem(STREAK_KEY) || "0", 10);
};

const updateStreak = (): number => {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem(LAST_DATE_KEY);
  let streak = getStreak();

  if (lastDate === today) return streak; // already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (lastDate === yesterday.toDateString()) {
    streak += 1;
  } else if (lastDate !== today) {
    streak = 1;
  }

  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(LAST_DATE_KEY, today);
  return streak;
};

const CircularProgress: React.FC<{
  current: number;
  total: number;
  isComplete: boolean;
  onTap: () => void;
  pulse: boolean;
}> = ({ current, total, isComplete, onTap, pulse }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / total, 1);
  const offset = circumference - progress * circumference;

  return (
    <button
      onClick={onTap}
      disabled={isComplete}
      className={`relative flex items-center justify-center w-[72px] h-[72px] rounded-full transition-transform ${
        pulse ? "scale-110" : "scale-100"
      } ${isComplete ? "cursor-default" : "cursor-pointer active:scale-95"}`}
    >
      <svg width="72" height="72" className="-rotate-90">
        <circle cx="36" cy="36" r={radius} stroke="hsl(var(--muted))" strokeWidth="5" fill="none" />
        <circle
          cx="36" cy="36" r={radius}
          stroke={isComplete ? "hsl(var(--success))" : "hsl(var(--primary))"}
          strokeWidth="5" fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums">
        {isComplete ? <Check className="w-5 h-5 text-success" /> : `${current}/${total}`}
      </span>
    </button>
  );
};

const AthkarCard: React.FC<{
  item: AthkarItem;
  currentCount: number;
  onTap: () => void;
  pulse: boolean;
}> = ({ item, currentCount, onTap, pulse }) => {
  const { language } = useLanguage();
  const isComplete = currentCount >= item.count;

  return (
    <Card className={`transition-all ${isComplete ? "opacity-60 border-success/30" : ""}`}>
      <CardContent className="p-4 flex gap-4">
        <CircularProgress
          current={currentCount}
          total={item.count}
          isComplete={isComplete}
          onTap={onTap}
          pulse={pulse}
        />
        <div className="flex-1 min-w-0 space-y-2">
          <p className="font-arabic-athkar text-foreground leading-relaxed text-right" dir="rtl">
            {item.arabic}
          </p>
          {language === "en" && (
            <>
              <p className="text-xs text-muted-foreground italic">{item.transliteration}</p>
              <p className="text-sm text-foreground/80">{item.translation_en}</p>
            </>
          )}
          {language === "ur" && (
            <p className="text-sm text-foreground/80 font-urdu" dir="rtl">{item.translation_ur}</p>
          )}
          <p className="text-xs text-muted-foreground">📖 {item.source}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const AthkarPage: React.FC = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"morning" | "evening">("morning");
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [pulseId, setPulseId] = useState<number | null>(null);
  const [streak, setStreak] = useState(getStreak);
  const [showConfetti, setShowConfetti] = useState(false);

  const items = tab === "morning" ? getMorningAthkar() : getEveningAthkar();
  const totalRequired = items.reduce((s, i) => s + i.count, 0);
  const totalDone = items.reduce((s, i) => s + Math.min(counts[i.id] || 0, i.count), 0);
  const sessionProgress = totalRequired > 0 ? (totalDone / totalRequired) * 100 : 0;
  const sessionComplete = totalDone >= totalRequired && totalRequired > 0;

  const handleTap = useCallback((item: AthkarItem) => {
    setCounts((prev) => {
      const current = prev[item.id] || 0;
      if (current >= item.count) return prev;
      const next = { ...prev, [item.id]: current + 1 };

      // Check if session complete after this tap
      const newTotal = items.reduce((s, i) => s + Math.min(next[i.id] || 0, i.count), 0);
      if (newTotal >= totalRequired) {
        const newStreak = updateStreak();
        setStreak(newStreak);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      return next;
    });

    setPulseId(item.id);
    setTimeout(() => setPulseId(null), 200);
  }, [items, totalRequired]);

  const handleReset = () => {
    setCounts({});
    setShowConfetti(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      {/* Confetti overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
          <div className="absolute text-4xl animate-ping" style={{ top: "20%", left: "20%" }}>✨</div>
          <div className="absolute text-4xl animate-ping" style={{ top: "30%", right: "25%" }}>🌟</div>
          <div className="absolute text-3xl animate-ping" style={{ bottom: "30%", left: "30%" }}>⭐</div>
          <div className="absolute text-3xl animate-ping" style={{ bottom: "20%", right: "20%" }}>✨</div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">📿 {t("navAthkar")}</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Flame className="w-3.5 h-3.5 text-secondary" />
            {streak} {t("streak") || "Streak"}
          </Badge>
          <Button variant="ghost" size="icon" onClick={handleReset} title="Reset">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Session progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{sessionComplete ? "✅ " : ""}{t("sessionProgress") || "Session Progress"}</span>
          <span className="tabular-nums">{totalDone}/{totalRequired}</span>
        </div>
        <Progress value={sessionProgress} className="h-2" />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => { setTab(v as "morning" | "evening"); setCounts({}); }}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="morning">🌅 {t("morning") || "Morning"}</TabsTrigger>
          <TabsTrigger value="evening">🌙 {t("evening") || "Evening"}</TabsTrigger>
        </TabsList>
        <TabsContent value="morning" className="space-y-3 mt-4">
          {getMorningAthkar().map((item) => (
            <AthkarCard
              key={item.id}
              item={item}
              currentCount={counts[item.id] || 0}
              onTap={() => handleTap(item)}
              pulse={pulseId === item.id}
            />
          ))}
        </TabsContent>
        <TabsContent value="evening" className="space-y-3 mt-4">
          {getEveningAthkar().map((item) => (
            <AthkarCard
              key={item.id}
              item={item}
              currentCount={counts[item.id] || 0}
              onTap={() => handleTap(item)}
              pulse={pulseId === item.id}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AthkarPage;
