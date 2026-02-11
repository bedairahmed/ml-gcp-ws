# Lab 02: Firebase Setup

⏱️ **Duration:** 25 minutes  
📋 **Objective:** Create a Firebase project (or use the shared one), enable Authentication and Firestore, and connect the app.

---

## 🎯 Learning Outcomes

- [ ] Create/access a Firebase project
- [ ] Enable Google Authentication
- [ ] Create a Firestore database
- [ ] Configure environment variables
- [ ] Deploy Firestore security rules

---

## Step 1: Access Firebase Console

Navigate to the [Firebase Console](https://console.firebase.google.com/).

### Option A: Use the Shared Workshop Project

Your instructor will provide:
- **Project ID:** `ml-gcp-workshop-487117`
- You'll use namespace isolation to keep your data separate

### Option B: Create Your Own Firebase Project

1. Click **Add Project**
2. Enter a project name (e.g., `madina-lab-yourname`)
3. Disable Google Analytics (optional for this workshop)
4. Click **Create Project**

---

## Step 2: Enable Authentication

1. In Firebase Console → **Authentication** → **Get Started**
2. Click **Google** under Sign-in providers
3. Toggle **Enable**
4. Set a support email address
5. Click **Save**

### Add Authorized Domains

Still in Authentication → **Settings** → **Authorized domains**:

Add these domains:
```
localhost
your-cloud-run-url.run.app
```

> 💡 You'll add your Cloud Run URL after deployment in Lab 05.

---

## Step 3: Create Firestore Database

1. In Firebase Console → **Firestore Database** → **Create Database**
2. Select **Production mode** (we have security rules)
3. Choose location: **us-central1**
4. Click **Create**

---

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (⚙️ gear icon) → **General**
2. Scroll to **Your apps** → Click **Web** (</>) icon
3. Register your app with nickname `madina-lab`
4. Copy the configuration values

---

## Step 5: Configure Environment Variables

Create your `.env` file:

```bash
cp .env.example .env
```

Fill in your Firebase values:

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Set your namespace (use your first name)
VITE_NAMESPACE=yourname
```

---

## Step 6: Test the Connection

Restart the dev server:

```bash
# Stop the running server (Ctrl+C), then:
npm run dev
```

1. Open http://localhost:8080
2. Click **Sign In** or **Get Started**
3. Sign in with Google
4. You should see the Home dashboard! 🎉

Check the browser console (F12 → Console) — there should be no Firebase errors.

---

## Step 7: Deploy Security Rules

Install Firebase CLI if you haven't:

```bash
npm install -g firebase-tools
firebase login
```

Deploy the rules:

```bash
firebase use your-project-id
firebase deploy --only firestore:rules
```

Expected output:
```
✔  firestore: released rules firestore.rules to cloud.firestore
```

---

## Step 8: Verify in Firestore

Go back to Firebase Console → **Firestore Database**

You should see your namespaced collections:
- `yourname_users` — Your user profile was auto-created on login

> 💡 If using namespace `alice`, all collections will be prefixed with `alice_`.

---

## ✅ Checkpoint

Before moving on, confirm:

- [ ] Firebase project accessible
- [ ] Google Auth enabled and working
- [ ] Firestore database created in `us-central1`
- [ ] `.env` file configured with your Firebase credentials
- [ ] App running locally with successful Google sign-in
- [ ] Security rules deployed
- [ ] User document visible in Firestore

---

## 🔗 Next Lab

➡️ [Lab 03: Docker Build](./03-docker-build.md)
