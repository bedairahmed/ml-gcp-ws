import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  HelpCircle, Search, Home, BookOpen, Calendar, MessageSquare,
  Store, Shield, Bell, Moon, Globe, User, Star, Clock,
} from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    icon: Home,
    items: [
      { q: "What is Madina Lab?", a: "Madina Lab is a trilingual (English, Arabic, Urdu) community platform for the Muslim Community of Western Suburbs (MCWS) in Canton, MI. It provides prayer times, community events, group chat, a business directory, daily athkar, and more." },
      { q: "How do I create an account?", a: "Go to the Sign In page and click 'Register'. You can sign up with email/password or use Google Sign-In. Choose between 'Community Member' or 'Business Owner' account type." },
      { q: "How do I change the language?", a: "Use the language switcher in the top header bar. Tap EN (English), ع (Arabic), or اردو (Urdu). Arabic and Urdu activate right-to-left layout automatically." },
      { q: "How do I enable dark mode?", a: "Tap the sun/moon icon in the top-right corner of the header to toggle between light and dark themes." },
    ],
  },
  {
    category: "Prayer Times & Athkar",
    icon: Clock,
    items: [
      { q: "Where do prayer times come from?", a: "Prayer times are fetched in real-time from the Aladhan API, calculated for Canton, MI using the ISNA calculation method." },
      { q: "How does the Athkar tracker work?", a: "Navigate to the Athkar page, choose Morning or Evening adhkar, and tap each dhikr card to count. Your progress and daily streak are tracked automatically." },
      { q: "Are the athkar authentic?", a: "Yes, all adhkar are sourced from authentic hadith collections including Sahih Bukhari, Sahih Muslim, and Hisnul Muslim." },
    ],
  },
  {
    category: "Community Events",
    icon: Calendar,
    items: [
      { q: "How do I RSVP to an event?", a: "Open any event card and tap the 'RSVP' button. Your RSVP will be recorded and the organizer will be notified." },
      { q: "Can I create events?", a: "Admins and moderators can create events using the '+ Create' button on the Events page. Community members can suggest events by contacting an admin." },
      { q: "What event categories are available?", a: "Events can be categorized as Jummah, Education, Social, Youth, Volunteer, or Ramadan." },
    ],
  },
  {
    category: "Community Chat",
    icon: MessageSquare,
    items: [
      { q: "How do I join a chat group?", a: "All members are automatically added to the 'General' group. Additional groups appear in the sidebar — tap any group name to switch channels." },
      { q: "Can I reply to specific messages?", a: "Yes! Tap the reply icon on any message to start a threaded reply. The original message will be quoted above your response." },
      { q: "How do reactions work?", a: "Tap the emoji icon on any message to add a reaction. Common Islamic phrases like 'MashaAllah' and 'SubhanAllah' are available as quick reactions." },
    ],
  },
  {
    category: "Business Directory",
    icon: Store,
    items: [
      { q: "How do I find a local Muslim business?", a: "Go to the Directory page and use the search bar or category filters (Restaurants, Grocery, Services, etc.) to browse listings." },
      { q: "How do I claim my business?", a: "Find your business in the Directory, open its detail page, and tap 'Claim This Business'. An admin will review and approve your claim." },
      { q: "How do I leave a review?", a: "Open a business detail page, scroll to Reviews, and tap 'Write a Review'. Select a star rating and write your feedback." },
      { q: "What does 'Verified' mean?", a: "Verified businesses have been confirmed by an admin as legitimate, active establishments. Halal-certified businesses are marked separately." },
    ],
  },
  {
    category: "My Business (Owners)",
    icon: Star,
    items: [
      { q: "How do I manage my business listing?", a: "Go to the 'My Business' page from the navigation menu. You can edit your description, contact info, operating hours, and respond to customer reviews." },
      { q: "How do I respond to reviews?", a: "In the My Business page, go to the Reviews tab. Click 'Respond' under any review to post an owner response." },
      { q: "How do I update my operating hours?", a: "In the My Business page, go to the Hours tab. Set open/close times for each day and toggle the 'Closed' switch for days you're not open." },
    ],
  },
  {
    category: "Notifications",
    icon: Bell,
    items: [
      { q: "How do notifications work?", a: "The bell icon in the header shows your unread notification count. You'll receive notifications for new reviews (business owners), claim approvals/rejections, and community announcements." },
      { q: "How do I mark notifications as read?", a: "Click the bell icon to open the notification panel. Click any notification to mark it as read, or use 'Mark all read' to clear all." },
    ],
  },
  {
    category: "Admin & Moderation",
    icon: Shield,
    items: [
      { q: "Who can access the Admin panel?", a: "Only users with Admin or Moderator roles can access the Admin page. Admins have full control; moderators can manage events and content." },
      { q: "How do I change a user's role?", a: "In the Admin panel → Users tab, find the user and use the role dropdown to change between Admin, Moderator, Member, and Business." },
      { q: "How do I approve a business claim?", a: "In the Admin panel → Claims tab, review pending claims and click 'Approve' or 'Reject'. The business owner will be notified automatically." },
    ],
  },
  {
    category: "Account & Profile",
    icon: User,
    items: [
      { q: "How do I update my profile?", a: "Go to the Profile page from the navigation. You can update your display name, language preference, and group memberships." },
      { q: "How do I upgrade to a Business account?", a: "On your Profile page, tap 'Upgrade to Business Account'. This allows you to claim and manage business listings." },
      { q: "How do I reset my password?", a: "On the Sign In page, click 'Forgot Password?' and enter your email. A password reset link will be sent to your inbox." },
    ],
  },
];

const HelpPage: React.FC = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <HelpCircle className="h-10 w-10 mx-auto text-primary" />
        <h1 className="font-heading text-2xl font-bold">Help & FAQ</h1>
        <p className="text-sm text-muted-foreground">Find answers to common questions about Madina Lab</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search help topics..."
          className="pl-9"
        />
      </div>

      {filteredFaqs.length === 0 && (
        <p className="text-center text-muted-foreground py-8">{t("noResults")}</p>
      )}

      {filteredFaqs.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {section.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Accordion type="multiple">
                {section.items.map((item, i) => (
                  <AccordionItem key={i} value={`${section.category}-${i}`}>
                    <AccordionTrigger className="text-sm text-left">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardContent className="p-6 text-center space-y-2">
          <p className="text-sm font-medium">Still need help?</p>
          <p className="text-xs text-muted-foreground">
            Contact the MCWS administration or reach out to the community moderators through the Chat page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
