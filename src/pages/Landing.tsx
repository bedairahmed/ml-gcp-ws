import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Clock, Cloud, BookOpen, Calendar, MessageSquare, Store,
  Shield, Bell, Globe, Moon, Star, Users, ChevronRight,
  ArrowRight, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import screenshotDashboard from "@/assets/screenshot-dashboard.jpg";
import screenshotChat from "@/assets/screenshot-chat.jpg";
import screenshotDirectory from "@/assets/screenshot-directory.jpg";

const features = [
  { icon: Clock, title: "Prayer Times", desc: "Real-time prayer schedule via Aladhan API with next-prayer countdown", color: "text-primary" },
  { icon: Cloud, title: "Live Weather", desc: "Current conditions for Canton, MI updated automatically", color: "text-secondary" },
  { icon: BookOpen, title: "Athkar Tracker", desc: "Morning & evening adhkar with tap counters and streak tracking", color: "text-accent" },
  { icon: Calendar, title: "Community Events", desc: "RSVP to Jummah, education, social, youth, and volunteer events", color: "text-primary" },
  { icon: MessageSquare, title: "Group Chat", desc: "Real-time channels with @mentions, reactions, and reply threads", color: "text-secondary" },
  { icon: Store, title: "Business Directory", desc: "Discover Muslim-owned businesses with reviews and halal certification", color: "text-accent" },
  { icon: Shield, title: "Admin Panel", desc: "User management, event moderation, claim approvals, announcements", color: "text-primary" },
  { icon: Bell, title: "Notifications", desc: "Stay updated on reviews, claim approvals, and community news", color: "text-secondary" },
  { icon: Globe, title: "Trilingual", desc: "Full English, Arabic, and Urdu support with RTL layout", color: "text-accent" },
];

const stats = [
  { value: "3", label: "Languages" },
  { value: "9+", label: "Features" },
  { value: "24/7", label: "Prayer Times" },
  { value: "∞", label: "Community" },
];

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌙</span>
            <span className="font-heading font-bold text-lg text-primary">Madina Lab</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/">
                <Button size="sm" className="gap-1.5">Dashboard <ArrowRight className="h-3.5 w-3.5" /></Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="gap-1.5">Get Started <ArrowRight className="h-3.5 w-3.5" /></Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            <Star className="h-3 w-3" /> Built for the MCWS Community
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight">
            Your Digital
            <span className="block text-primary"> Community Companion</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Prayer times, community events, group chat, business directory, and daily athkar —
            all in one trilingual platform for the Muslim community of Canton, MI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link to="/auth">
              <Button size="lg" className="gap-2 px-8 text-base">
                Join the Community <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg" className="gap-2 px-8 text-base">
                Explore Features <ChevronRight className="h-4 w-4" />
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-heading font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">
            See It In Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: screenshotDashboard, label: "Home Dashboard", sub: "Prayer times, weather & quick stats" },
              { img: screenshotChat, label: "Community Chat", sub: "Real-time messaging with reactions" },
              { img: screenshotDirectory, label: "Business Directory", sub: "Discover local Muslim businesses" },
            ].map((s) => (
              <div key={s.label} className="text-center space-y-3 group">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border bg-card mx-auto max-w-[260px] transition-transform group-hover:scale-[1.02]">
                  <img src={s.img} alt={s.label} className="w-full h-auto" loading="lazy" />
                </div>
                <h3 className="font-semibold">{s.label}</h3>
                <p className="text-sm text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Everything Your Community Needs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A comprehensive platform designed specifically for the Muslim community experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-xl border bg-card p-5 space-y-3 hover:shadow-lg transition-shadow">
                  <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${f.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trilingual CTA */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Globe className="h-10 w-10 mx-auto text-primary" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Speak Your Language</h2>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">EN</p>
              <p className="text-sm text-muted-foreground">English</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary font-arabic">ع</p>
              <p className="text-sm text-muted-foreground">العربية</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">اردو</p>
              <p className="text-sm text-muted-foreground">Urdu</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Full right-to-left support for Arabic and Urdu with automatic layout switching.
          </p>
        </div>
      </section>

      {/* Checklist */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl border bg-card p-8 md:p-12 space-y-6">
            <h2 className="font-heading text-2xl font-bold text-center">Why Madina Lab?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Accurate prayer times (Aladhan API)",
                "Real-time community chat",
                "Muslim business directory with reviews",
                "Claim & verify your business listing",
                "Daily athkar with streak tracking",
                "Community events with RSVP",
                "Admin panel for moderators",
                "In-app notifications",
                "Dark mode & trilingual support",
                "Open source & self-hostable",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        <div className="relative max-w-3xl mx-auto px-4 text-center space-y-6">
          <span className="text-5xl">🌙</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Ready to Join Your Community?
          </h2>
          <p className="text-lg text-muted-foreground">
            Assalamu Alaikum — Start your journey with Madina Lab today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="gap-2 px-10 text-base mt-4">
              <Users className="h-4 w-4" /> Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>🌙</span>
            <span className="font-heading font-semibold text-foreground">Madina Lab</span>
            <span>— Built with ❤️ for MCWS</span>
          </div>
          <p>Instructor: Ahmed Bedair | GCP Cloud Engineering Workshop</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
