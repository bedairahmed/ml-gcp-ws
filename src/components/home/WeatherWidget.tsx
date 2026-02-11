import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const CANTON_MI = { lat: 42.3087, lng: -83.4821 };

interface WeatherData {
  temperature: number;
  apparentTemp: number;
  high: number;
  low: number;
  weatherCode: number;
}

const weatherIcons: Record<number, string> = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️",
  51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌧️", 63: "🌧️", 65: "🌧️",
  71: "🌨️", 73: "🌨️", 75: "🌨️",
  77: "🌨️", 80: "🌧️", 81: "🌧️", 82: "🌧️",
  85: "🌨️", 86: "🌨️",
  95: "⛈️", 96: "⛈️", 99: "⛈️",
};

const weatherConditions: Record<number, { en: string; ar: string; ur: string }> = {
  0: { en: "Clear sky", ar: "سماء صافية", ur: "صاف آسمان" },
  1: { en: "Mostly clear", ar: "غالباً صافي", ur: "زیادہ تر صاف" },
  2: { en: "Partly cloudy", ar: "غائم جزئياً", ur: "جزوی ابر آلود" },
  3: { en: "Overcast", ar: "غائم", ur: "ابر آلود" },
  45: { en: "Foggy", ar: "ضبابي", ur: "دھند" },
  48: { en: "Foggy", ar: "ضبابي", ur: "دھند" },
  51: { en: "Light drizzle", ar: "رذاذ خفيف", ur: "ہلکی بوندا باندی" },
  53: { en: "Drizzle", ar: "رذاذ", ur: "بوندا باندی" },
  55: { en: "Heavy drizzle", ar: "رذاذ كثيف", ur: "تیز بوندا باندی" },
  61: { en: "Light rain", ar: "مطر خفيف", ur: "ہلکی بارش" },
  63: { en: "Rain", ar: "مطر", ur: "بارش" },
  65: { en: "Heavy rain", ar: "مطر غزير", ur: "تیز بارش" },
  71: { en: "Light snow", ar: "ثلج خفيف", ur: "ہلکی برف" },
  73: { en: "Snow", ar: "ثلج", ur: "برف" },
  75: { en: "Heavy snow", ar: "ثلج كثيف", ur: "تیز برف" },
  95: { en: "Thunderstorm", ar: "عاصفة رعدية", ur: "آندھی" },
};

const WeatherWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${CANTON_MI.lat}&longitude=${CANTON_MI.lng}&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FDetroit`
        );
        const data = await res.json();
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          apparentTemp: Math.round(data.current.apparent_temperature),
          high: Math.round(data.daily.temperature_2m_max[0]),
          low: Math.round(data.daily.temperature_2m_min[0]),
          weatherCode: data.current.weather_code,
        });
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const getConditionText = (code: number) => {
    const condition = weatherConditions[code] || weatherConditions[0];
    return condition[language] || condition.en;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle><Skeleton className="h-6 w-32" /></CardTitle></CardHeader>
        <CardContent><Skeleton className="h-16 w-full" /></CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card>
        <CardHeader><CardTitle>🌤️ Weather</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">{t("error")}</p></CardContent>
      </Card>
    );
  }

  const icon = weatherIcons[weather.weatherCode] || "🌤️";

  return (
    <Card>
      <CardHeader className="pb-3 bg-secondary/5">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>{icon} Weather</span>
          <span className="text-xs font-normal text-muted-foreground">Canton, MI</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold font-heading">{weather.temperature}°F</p>
            <p className="text-sm text-muted-foreground mt-1">{getConditionText(weather.weatherCode)}</p>
          </div>
          <div className="text-end space-y-1">
            <p className="text-xs text-muted-foreground">
              {t("feelsLike")} <span className="font-medium text-foreground">{weather.apparentTemp}°F</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {t("high")} <span className="font-medium text-foreground">{weather.high}°</span> · {t("low")} <span className="font-medium text-foreground">{weather.low}°</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
