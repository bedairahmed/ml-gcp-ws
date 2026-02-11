# Lab 08: Namespace Isolation

⏱️ **Duration:** 10 minutes  
📋 **Objective:** Understand and verify how namespace isolation keeps each student's data separate in the shared Firestore.

---

## 🎯 Learning Outcomes

- [ ] Understand the namespace isolation pattern
- [ ] Verify your data is isolated from other students
- [ ] See how the same code works with different namespaces

---

## Step 1: Understand the Pattern

The `ns()` function in `src/lib/namespace.ts` prefixes all Firestore collection names:

```typescript
// VITE_NAMESPACE=alice
ns("users")         → "alice_users"
ns("messages")      → "alice_messages"
ns("events")        → "alice_events"
ns("notifications") → "alice_notifications"

// VITE_NAMESPACE not set
ns("users")         → "users"
```

**Why this works:**

```
┌─────────────── Shared Firestore ───────────────┐
│                                                  │
│  alice_users    bob_users    charlie_users       │
│  alice_events   bob_events   charlie_events     │
│  alice_messages bob_messages charlie_messages    │
│                                                  │
│  Each student has their own "virtual database"  │
└──────────────────────────────────────────────────┘
```

---

## Step 2: Check Your Namespace

### In the Browser Console

Open your deployed app → Press `F12` → Console tab:

```javascript
// Check what namespace is active
console.log(import.meta.env.VITE_NAMESPACE);
```

### In Firestore Console

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Firestore**
2. Look at the collections list
3. You should see collections prefixed with your name:
   - `yourname_users`
   - `yourname_groups`
   - `yourname_messages`

---

## Step 3: Verify Isolation

### Create Test Data

1. Open your deployed app
2. Sign in with Google
3. Go to **Chat** → Send a message: "Hello from [yourname]! 👋"

### Check Firestore

1. In Firebase Console → Firestore
2. Open `yourname_messages` collection
3. You should see your message
4. Check another student's collection (e.g., `otherstudent_messages`)
5. Your message should **NOT** be there

> 💡 Each student sees only their own data, even though it's the same Firestore database!

---

## Step 4: How It's Configured

| Environment | Where Namespace Is Set |
|------------|----------------------|
| **Local dev** | `.env` file: `VITE_NAMESPACE=yourname` |
| **Docker** | `docker-compose.yml` or `-e VITE_NAMESPACE=yourname` |
| **Cloud Build** | `--substitutions=_STUDENT_NAMESPACE=yourname` |

The value flows through the build pipeline:

```
.env / substitution
    → Vite build arg
        → Baked into JavaScript bundle
            → ns() reads it at runtime
                → Firestore queries use prefixed collection names
```

---

## Step 5: Security Considerations

The namespace pattern provides **logical isolation**, not security isolation:

| ✅ What It Prevents | ❌ What It Doesn't Prevent |
|---------------------|--------------------------|
| Students accidentally reading each other's data | A determined student directly querying another namespace |
| Data collisions between students | Bypassing namespace via direct Firestore API calls |
| Clean workshop experience | Production-grade multi-tenancy |

> 💡 For production apps, use **Firestore Security Rules** (which we deployed in Lab 02) for real access control. Namespaces are a convenience for workshops.

---

## ✅ Final Checkpoint

Congratulations! You've completed all labs! 🎉

Review what you've accomplished:

- [x] **Lab 00:** Set up development environment
- [x] **Lab 01:** Understood the application architecture
- [x] **Lab 02:** Configured Firebase Auth & Firestore
- [x] **Lab 03:** Built a multi-stage Docker container
- [x] **Lab 04:** Set up GCP APIs, IAM, and secrets
- [x] **Lab 05:** Deployed to Cloud Run
- [x] **Lab 06:** Automated deployments with CI/CD
- [x] **Lab 07:** Managed infrastructure with Terraform
- [x] **Lab 08:** Verified namespace data isolation

---

## 🎓 What's Next?

| Direction | Resources |
|-----------|-----------|
| **GCP Certifications** | [Cloud Engineer](https://cloud.google.com/certification/cloud-engineer) |
| **Kubernetes** | Deploy to GKE instead of Cloud Run |
| **Monitoring** | Add Cloud Monitoring & Logging |
| **Custom domains** | Map a domain to your Cloud Run service |
| **Cloud Functions** | Add server-side logic for admin operations |

---

> 💡 **Remember:** This workshop is a starting point — not the finish line.  
> Keep building, keep learning! 🚀

---

**Made with ❤️ for the MCWS Community**  
*☁️ GCP Cloud Engineering Workshop — Ahmed Bedair*
