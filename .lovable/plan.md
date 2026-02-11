

# Madina Lab — Community App Implementation Plan

**Tagline:** Your Digital Community Companion | رفيقك الرقمي في المجتمع | آپ کا ڈیجیٹل کمیونٹی ساتھی

A trilingual (English, Arabic, Urdu) community platform for the Muslim community of Canton, Michigan — featuring prayer times, athkar tracking, community chat, events, a Muslim business directory, and admin tools. Built with React, TypeScript, Tailwind CSS, and Firebase.

---

## Phase 1: Foundation & Core Infrastructure

### Design System & Theming
- Custom color palette: Deep Teal (#0D7377) primary, Gold (#D4A84B) secondary, Navy (#1B2A4A) dark, Cream (#FFF8F0) background
- Dark mode support with system preference detection
- Islamic geometric watermark/patterns in headers
- Card styling with subtle shadows and 12px radius
- Custom fonts: Inter/Poppins (English), Amiri/Noto Naskh Arabic (Arabic), Noto Nastaliq Urdu (Urdu)

### Trilingual Translation System
- Language context with EN/AR/UR support
- RTL layout auto-switching for Arabic and Urdu
- Language selector (EN | ع | اردو) in the header
- Structured translation objects throughout the app

### Firebase Client SDK Integration
- Firebase Auth (email/password + Google Sign-In)
- Firestore for all data collections
- AuthContext, LanguageContext, ThemeContext providers
- Environment variables via VITE_ prefix

### Navigation & Layout
- Bottom tab bar (mobile): Home, Athkar, Events, Chat, Directory + conditional My Business & Admin tabs
- Left sidebar navigation (desktop)
- Header: crescent moon logo, language switcher, dark mode toggle, user avatar, about info icon
- Protected routes for admin and business dashboards

### DevOps Files
- Dockerfile (multi-stage build with nginx)
- docker-compose.yml for local development
- cloudbuild.yaml for GCP Cloud Build CI/CD pipeline

---

## Phase 2: Authentication & User Profiles

### Login / Register Page
- Centered card with Islamic geometric background
- Sign In / Register tabs
- Account type selector: Community Member (👤) or Business Owner (🏪)
- Google Sign-In (defaults to member role)
- Form validation with trilingual error messages
- Firestore user document creation with role, auto-join "general" group
- Business owners get redirected to "Add Your First Business" wizard

### Profile Page
- Editable display name, avatar, language selector, dark mode toggle
- Role badge display, groups list, member since date
- "Upgrade to Business Account" for members
- "My Businesses" shortcut for business role
- Admin Dashboard link for admins
- Logout

---

## Phase 3: Home Dashboard — Prayer Times & Weather

### Prayer Times Widget
- Aladhan API integration with configurable city/method
- 5 daily prayers + Sunrise with trilingual names
- Live countdown timer to next prayer with glowing highlight animation
- Hijri + Gregorian date display
- Auto-refresh at midnight

### Weather Widget
- Open-Meteo API with temperature (°F), condition, high/low, feels like
- Weather icons and trilingual condition text

### Welcome Banner
- Personalized greeting ("Assalamu Alaikum, [name]") in selected language
- Role badge, quick stats: next prayer, active events, unread messages

---

## Phase 4: Athkar Tracker

### Morning & Evening Athkar
- 10 items each from Hisn al-Muslim with proper Arabic text (Amiri font, 24px+)
- English transliteration, English translation, Urdu translation, source reference
- Morning/Evening tabs with appropriate wording variants

### Interactive Counter
- Tap counter with circular progress per dhikr item
- Pulse animation on tap, green checkmark on completion
- Session progress bar
- Streak counter (local storage)
- Confetti animation on full session completion
- Reset per session

---

## Phase 5: Community Events

### Event Listings
- Real-time Firestore, filtered by user's groups
- Cards with trilingual titles, date/time, location, category color tag
- Categories: Jummah (green), Education (blue), Social (orange), Youth (purple), Volunteer (teal), Ramadan (gold)
- RSVP toggle for members
- Past events collapse automatically

### Announcement Banner
- Rotating announcements from Firestore (trilingual)
- Preloaded Ramadan announcement

### Event Management
- Create/Edit/Delete for admins and moderators
- Preloaded with 6 trilingual sample events

---

## Phase 6: Community Chat & Direct Messages

### Group Chat
- Group sidebar (desktop) / horizontal tabs (mobile) with unread indicators
- Real-time messages with role badges (🛡️ admin, ⭐ mod, 🏪 business)
- RTL auto-detection per message, date separators
- Load last 50 messages with "Load earlier" pagination

### User @Mentions
- "@" trigger opens searchable user popup
- Teal-colored mention tags in messages
- Tappable mentions open mini-profile with "Send DM" option
- "@everyone" for admins/mods with gold highlight

### Reply & Reactions
- Swipe/hover to reply with quoted preview block
- Long press/hover reaction bar: ❤️ 👍 😂 🤲 ما شاء الله
- Reaction pills with counts below messages

### Direct Messages
- Conversation list with last message preview, unread badges, online status
- Start new DM via searchable user list
- Read receipts ("Seen ✓✓"), typing indicator
- Same features as group chat (replies, reactions, emoji)

### Emoji & Islamic Phrases Panel
- Emojis tab (Smileys, Gestures, Objects, Food, Nature)
- Islamic Phrases tab (14 common phrases with Arabic + transliteration)
- Recently Used tab (local storage)

### Moderation
- Soft delete for admins/mods → "Message removed by moderator" (trilingual)
- Typing indicator with dot animation

### Preloaded Data
- 5 sample messages in "general" group from various roles

---

## Phase 7: Muslim Business Directory

### Business Listings
- Grid/list toggle with cards showing: name, category, star rating, review count, address, phone, badges (Halal ✅, Verified ✓)
- Quick actions: Call, Website, Directions
- Search by name/description/tags
- Category filter chips (12 categories with icons)
- Filters: min rating, halal certified, verified, sort options

### Business Detail Page
- Full info: hours (today highlighted), photo gallery, tags, Google Maps directions link
- "Claim This Business" button for unclaimed listings
- Reviews section: rating summary with bar chart, individual reviews with helpful toggle
- Owner response cards on reviews
- Write/Edit review with star selector and auto RTL detection

### Add Business Form
- Trilingual name fields, category/subcategory, description, contact info
- Business hours per day, tags, halal certified toggle
- Submitted as "Pending Verification"

### Business Owner Dashboard (Business Role)
- List of owned businesses with stats (rating, reviews)
- Respond to reviews
- Edit business details
- Claim existing businesses (pending admin approval)
- Add new businesses

### Preloaded Data
- 12 Canton, MI businesses across all categories with details and ratings
- 2-3 sample reviews per top businesses with mixed languages

---

## Phase 8: Admin Dashboard & About

### Admin Dashboard (Admin Role Only)
- Overview cards: total users, messages today, active events, groups, businesses stats
- **User Management:** searchable table with role assignment, group management, activate/deactivate
- **Group Management:** CRUD with trilingual names, icons, colors (6 preloaded groups)
- **Announcement Management:** CRUD with active toggle and priority
- **Business Management:** verify/unverify, halal certify, approve/reject claims, pending queues
- **Review Moderation:** delete inappropriate reviews

### About Modal
- App info, tagline (trilingual), version, tech badges
- Admin setup instructions for first user

