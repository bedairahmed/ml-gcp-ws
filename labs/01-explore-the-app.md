# Lab 01: Explore the App

⏱️ **Duration:** 20 minutes  
📋 **Objective:** Understand the application architecture, features, and how the code is organized.

---

## 🎯 Learning Outcomes

- [ ] Understand the tech stack (React, Firebase, Vite)
- [ ] Identify key components and pages
- [ ] Understand the data flow (Firestore → Hooks → Components)

---

## Step 1: Review the Architecture

The app follows a standard React architecture:

```
Browser → React Router → Pages → Components → Hooks → Firebase
```

| Layer | Role | Example |
|-------|------|---------|
| **Pages** | Route-level views | `Home.tsx`, `Chat.tsx`, `Directory.tsx` |
| **Components** | Reusable UI pieces | `EventCard.tsx`, `MessageBubble.tsx` |
| **Hooks** | Data fetching & logic | `useChat.ts`, `useEvents.ts` |
| **Contexts** | Global state | `AuthContext.tsx`, `LanguageContext.tsx` |
| **Config** | External services | `firebase.ts`, `namespace.ts` |

---

## Step 2: Explore Key Files

Open each file in VS Code and read the comments:

### 2.1 — Firebase Configuration

```bash
# How the app connects to Firebase
code src/config/firebase.ts
```

**Key concept:** Environment variables (`VITE_FIREBASE_*`) configure which Firebase project to use.

### 2.2 — Authentication Context

```bash
code src/contexts/AuthContext.tsx
```

**Key concept:** `onAuthStateChanged` listens for login/logout events. User profiles are stored in Firestore.

### 2.3 — Namespace Isolation

```bash
code src/lib/namespace.ts
```

**Key concept:** The `ns()` function prefixes collection names with `VITE_NAMESPACE`, allowing multiple students to share one Firestore database.

### 2.4 — A Data Hook

```bash
code src/hooks/useChat.ts
```

**Key concept:** `onSnapshot` creates real-time listeners — data updates automatically when Firestore changes.

---

## Step 3: Trace a Feature End-to-End

Let's trace how **Community Chat** works:

```
1. User opens /chat
2. Chat.tsx renders → calls useChat("general")
3. useChat subscribes to Firestore "messages" collection
4. Messages render as MessageBubble components
5. User types → MessageComposer calls sendMessage()
6. sendMessage() writes to Firestore → triggers onSnapshot
7. All connected users see the new message instantly
```

> 💡 This is the **real-time sync** pattern that Firebase excels at.

---

## Step 4: Understand the Routing

Open `src/App.tsx` and identify:

| Route | Page | Auth Required? |
|-------|------|---------------|
| `/landing` | Landing page | ❌ No |
| `/auth` | Login page | ❌ No |
| `/` | Home dashboard | ✅ Yes |
| `/chat` | Community chat | ✅ Yes |
| `/events` | Events calendar | ✅ Yes |
| `/directory` | Business directory | ✅ Yes |
| `/admin` | Admin panel | ✅ Admin only |

**Key concept:** `ProtectedRoute` redirects unauthenticated users to `/landing`.

---

## Step 5: Identify the Firestore Collections

| Collection | Used By | Purpose |
|-----------|---------|---------|
| `users` | AuthContext, useAdmin | User profiles & roles |
| `messages` | useChat | Chat messages |
| `groups` | useChat | Chat channels |
| `events` | useEvents | Community events |
| `announcements` | useEvents, useAdmin | Admin announcements |
| `businesses` | useDirectory | Business listings |
| `businessClaims` | useDirectory, useAdmin | Claim requests |
| `notifications` | useNotifications | User notifications |

---

## ✅ Checkpoint

Before moving on, confirm you understand:

- [ ] How React components fetch data from Firestore
- [ ] The role of `AuthContext` in protecting routes
- [ ] How namespace isolation works via `ns()`
- [ ] The real-time sync pattern with `onSnapshot`
- [ ] Which Firestore collections the app uses

---

## 🔗 Next Lab

➡️ [Lab 02: Firebase Setup](./02-firebase-setup.md)
