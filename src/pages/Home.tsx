import React from "react";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import PrayerTimesWidget from "@/components/home/PrayerTimesWidget";
import WeatherWidget from "@/components/home/WeatherWidget";

const HomePage: React.FC = () => {
  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <WelcomeBanner />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PrayerTimesWidget />
        <WeatherWidget />
      </div>
    </div>
  );
};

export default HomePage;
