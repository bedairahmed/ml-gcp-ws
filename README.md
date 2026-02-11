# ☁️ Madina Lab — Cloud Application Workshop

**GCP · Firebase · Docker · Terraform · Cloud Run**

> Hands-on GCP Workshop — Build, containerize, and deploy a full-stack community platform

Welcome to the **Madina Lab GCP Cloud Engineering Workshop**! This project is a production-ready community platform that you'll deploy to Google Cloud using modern DevOps practices.

---

## 📋 Workshop Overview

This workshop focuses on **real-world cloud deployment** — not just theory. By the end, you'll have deployed a full-stack application to GCP with CI/CD, secrets management, and infrastructure as code.

### What You'll Learn

| | Skill | Description |
|---|---|---|
| 🏗️ | **Application Architecture** | React + Firebase full-stack design |
| 🐳 | **Containerization** | Multi-stage Docker builds with nginx |
| ☁️ | **Cloud Deployment** | Google Cloud Run serverless hosting |
| 🔐 | **Secrets Management** | GCP Secret Manager for API keys |
| 🔄 | **CI/CD Pipelines** | Automated builds with Cloud Build |
| 🏛️ | **Infrastructure as Code** | Terraform for GCP resources |
| 🔥 | **Backend Services** | Firebase Auth + Firestore real-time database |
| 🛡️ | **Security** | Firestore rules, input validation, RBAC |

---

## 📅 Your Workshop Journey

### Phase 1: Understand & Configure

| Step | Task | Description |
|------|------|-------------|
| 01 | **Clone Repository** | Fork and clone the project |
| 02 | **Explore the App** | Run locally, understand the architecture |
| 03 | **Firebase Setup** | Configure Auth + Firestore |
| 04 | **Environment Config** | Set up environment variables |

### Phase 2: Containerize & Deploy

| Step | Task | Description |
|------|------|-------------|
| 05 | **Docker Build** | Build multi-stage container image |
| 06 | **Enable GCP APIs** | Activate Cloud Run, Build, Secret Manager |
| 07 | **Configure IAM** | Set up service account permissions |
| 08 | **Create Secrets** | Store Firebase keys in Secret Manager |
| 09 | **Deploy to Cloud Run** | Ship it! 🚀 |

### Phase 3: Automate & Scale

| Step | Task | Description |
|------|------|-------------|
| 10 | **CI/CD Pipeline** | Automate with Cloud Build |
| 11 | **Terraform** | Manage infrastructure as code |
| 12 | **Namespace Isolation** | Multi-student data isolation |

---

## ✨ Application Features

| Feature | Description |
|---------|-------------|
| 🕐 **Prayer Times** | Real-time prayer schedule via Aladhan API (ISNA method) |
| 🌤️ **Weather Widget** | Live weather for Canton, MI via Open-Meteo API |
| 📿 **Athkar Tracker** | Morning & evening adhkar with tap counters, streak tracking |
| 📅 **Community Events** | RSVP system, category filters, admin event creation |
| 💬 **Community Chat** | Group channels with @mentions, reactions, reply threads |
| 🏢 **Business Directory** | Listings with reviews, ratings, claim/verify workflow |
| 🏪 **My Business** | Business owners manage listings, respond to reviews |
| 🛡️ **Admin Panel** | User management, event moderation, claim approvals |
| 🔔 **Notifications** | In-app notifications for reviews, claims, announcements |
| ❓ **Help & FAQ** | Searchable help center with categorized FAQ |
| 🌐 **Trilingual** | English, Arabic, Urdu with full RTL support |
| 🌙 **Dark Mode** | Full dark/light theme toggle |

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, TypeScript, Vite | UI framework & build tooling |
| **UI** | Tailwind CSS, shadcn/ui, Lucide Icons | Styling & components |
| **Backend** | Firebase Auth + Firestore | Authentication & real-time database |
| **APIs** | Aladhan, Open-Meteo | Prayer times & weather data |
| **Container** | Docker (multi-stage) | Node.js build → nginx serve |
| **CI/CD** | Google Cloud Build | Automated build & deploy |
| **Hosting** | Google Cloud Run | Serverless container hosting |
| **Secrets** | GCP Secret Manager | Secure credential storage |
| **IaC** | Terraform | Infrastructure automation |

---

## 🏛️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   GitHub     │────▶│ Cloud Build  │────▶│   Cloud Run      │
│   (Source)   │     │ (CI/CD)      │     │   (Hosting)      │
└─────────────┘     └──────┬───────┘     └──────────────────┘
                           │
                    ┌──────▼───────┐     ┌──────────────────┐
                    │  Container   │     │  Secret Manager  │
                    │  Registry    │     │  (API Keys)      │
                    └──────────────┘     └──────────────────┘

                    ┌──────────────────────────────────────┐
                    │       Firebase / Firestore            │
                    │   (Auth, Database, Real-time Sync)    │
                    └──────────────────────────────────────┘
```

---

## 🎯 Prerequisites

Before starting the workshop, ensure you have:

- [ ] **GCP Account** — With billing enabled ([Free tier](https://cloud.google.com/free))
- [ ] **Git installed** — [Download Git](https://git-scm.com/downloads)
- [ ] **VS Code installed** — [Download VS Code](https://code.visualstudio.com/)
- [ ] **Docker installed** — [Download Docker](https://docs.docker.com/get-docker/)
- [ ] **Google Cloud SDK** — [Install gcloud CLI](https://cloud.google.com/sdk/docs/install)
- [ ] **Terraform** — [Install Terraform](https://developer.hashicorp.com/terraform/downloads)
- [ ] **Node.js 20+** — [Download Node.js](https://nodejs.org/)

> 💡 GCP credentials and Firebase project details will be provided during the workshop

---

## 🔐 Student Access

| Setting | Value |
|---------|-------|
| **GCP Project** | `ml-gcp-workshop-487117` |
| **Region** | `us-central1` |
| **Firebase Console** | [console.firebase.google.com](https://console.firebase.google.com/) |
| **GCP Console** | [console.cloud.google.com](https://console.cloud.google.com/) |

### Important Guidelines

✅ Always deploy to `us-central1` region  
✅ Use your assigned namespace: `VITE_NAMESPACE=yourname`  
✅ Use minimum resources (256Mi memory, 1 CPU)  
⚠️ Clean up resources after labs  
❌ Do not modify shared Firestore security rules  

---

## 🚀 Quick Start

### Local Development

```bash
# Clone and install
git clone <YOUR_GIT_URL>
cd madina-lab
npm install

# Start dev server
npm run dev
# Visit http://localhost:8080
```

### Docker

```bash
# Build and run
docker compose up --build
# Visit http://localhost:8080
```

### Docker (manual)

```bash
docker build -t madina-lab .
docker run -p 8080:8080 madina-lab
```

---

## ☁️ GCP Deployment

### Step 1: Enable APIs

```bash
export PROJECT_ID="your-gcp-project-id"
gcloud config set project $PROJECT_ID

gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com \
  firebase.googleapis.com \
  firestore.googleapis.com
```

### Step 2: Configure IAM

```bash
export CB_SA=$(gcloud projects describe $PROJECT_ID \
  --format='value(projectNumber)')@cloudbuild.gserviceaccount.com

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CB_SA" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CB_SA" --role="roles/iam.serviceAccountUser"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CB_SA" --role="roles/secretmanager.secretAccessor"
```

### Step 3: Create Secrets

```bash
echo -n "YOUR_API_KEY" | gcloud secrets create firebase-api-key --data-file=-
echo -n "your-project.firebaseapp.com" | gcloud secrets create firebase-auth-domain --data-file=-
echo -n "your-project-id" | gcloud secrets create firebase-project-id --data-file=-
echo -n "your-project.appspot.com" | gcloud secrets create firebase-storage-bucket --data-file=-
echo -n "123456789" | gcloud secrets create firebase-messaging-sender-id --data-file=-
echo -n "1:123456789:web:abcdef" | gcloud secrets create firebase-app-id --data-file=-
```

### Step 4: Deploy

```bash
# Option A: Cloud Build
gcloud builds submit --config cloudbuild.yaml .

# Option B: Terraform
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init && terraform apply
```

---

## 🔀 Namespace Isolation (Lab Mode)

For workshops where multiple students deploy to the **same Firestore**, each student sets `VITE_NAMESPACE` to isolate their data:

```bash
# Student 1
VITE_NAMESPACE=student1 docker compose up --build

# Student 2
VITE_NAMESPACE=student2 docker compose up --build
```

| Without namespace | With `VITE_NAMESPACE=alice` |
|---|---|
| `users` | `alice_users` |
| `events` | `alice_events` |
| `businesses` | `alice_businesses` |
| `notifications` | `alice_notifications` |
| `messages` | `alice_messages` |

> 💡 If `VITE_NAMESPACE` is not set, collections use their default names (no prefix).

---

## 🔥 Firebase Setup

1. [Firebase Console](https://console.firebase.google.com/) → Add/select your GCP project
2. **Authentication** → Enable Google provider → Add authorized domains
3. **Firestore** → Create database in production mode (`us-central1`)
4. **Deploy security rules:** `firebase deploy --only firestore:rules`

### Firestore Collections

| Collection | Purpose |
|-----------|---------|
| `users` | User profiles with roles, language, groups |
| `groups` | Chat groups/channels |
| `messages` | Chat messages per group |
| `events` | Community events with RSVPs |
| `announcements` | Admin announcements |
| `businesses` | Business directory listings |
| `businesses/{id}/reviews` | Business reviews (subcollection) |
| `businessClaims` | Business claim requests |
| `notifications` | In-app user notifications |

### User Roles

| Role | Access |
|------|--------|
| `admin` | Full platform control, user management, claim approvals |
| `moderator` | Event moderation, content management |
| `business` | Business listing management, review responses |
| `member` | Standard community access |

---

## 📁 Project Structure

```
madina-lab/
├── README.md                    # This file
├── Dockerfile                   # Multi-stage Docker build
├── docker-compose.yml           # Local Docker development
├── cloudbuild.yaml              # GCP Cloud Build CI/CD
├── firebase.json                # Firebase configuration
├── firestore.rules              # Firestore security rules
├── src/
│   ├── components/
│   │   ├── admin/               # Admin panel (UserManagement, EventModeration, etc.)
│   │   ├── chat/                # Chat UI (GroupList, MessageBubble, MessageComposer)
│   │   ├── directory/           # Business cards, detail dialog, star ratings
│   │   ├── events/              # Event cards, category filters, add event dialog
│   │   ├── home/                # Prayer times, weather, welcome banner
│   │   ├── layout/              # Header, BottomNav, Sidebar, NotificationBell
│   │   └── ui/                  # shadcn/ui components
│   ├── config/                  # Firebase configuration
│   ├── contexts/                # Auth, Language, Theme providers
│   ├── data/                    # Sample data, translations, athkar
│   ├── hooks/                   # useChat, useEvents, useAdmin, useDirectory
│   ├── lib/                     # Utilities, notifications, namespace isolation
│   └── pages/                   # Route pages
└── terraform/                   # GCP infrastructure as code
    ├── main.tf
    ├── cloud_run.tf
    ├── iam.tf
    ├── secrets.tf
    └── variables.tf
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Permission denied` on Cloud Build | Re-run IAM commands above |
| Build fails with `secret not found` | Verify: `gcloud secrets list` |
| Blank page after deploy | Check logs: `gcloud run services logs read madina-lab` |
| Firebase auth popup blocked | Add Cloud Run domain to Firebase authorized domains |
| Docker build fails locally | Ensure Node.js 20+ and run `npm install` first |
| Firebase config missing error | Set `VITE_FIREBASE_*` environment variables |

### Useful Commands

```bash
gcloud config get-value project          # Check active project
gcloud services list --enabled           # Check enabled APIs
gcloud run services list                 # List Cloud Run services
curl https://YOUR_URL/health             # Test health endpoint
firebase deploy --only firestore:rules   # Deploy security rules
```

---

## 📚 Resources

| Resource | Link |
|----------|------|
| **Cloud Build Docs** | [cloud.google.com/build/docs](https://cloud.google.com/build/docs) |
| **Cloud Run Docs** | [cloud.google.com/run/docs](https://cloud.google.com/run/docs) |
| **Secret Manager Docs** | [cloud.google.com/secret-manager/docs](https://cloud.google.com/secret-manager/docs) |
| **Terraform GCP** | [registry.terraform.io/providers/hashicorp/google](https://registry.terraform.io/providers/hashicorp/google/latest/docs) |
| **Firebase Docs** | [firebase.google.com/docs](https://firebase.google.com/docs) |
| **Docker Multi-stage** | [docs.docker.com/build/building/multi-stage](https://docs.docker.com/build/building/multi-stage/) |

---

## 📞 Workshop Instructor

**Ahmed Bedair**  
Senior Cloud Architect

| | |
|---|---|
| 📧 **Email** | abedair@gmail.com |
| 💼 **LinkedIn** | [linkedin.com/in/ahmedbedair](https://linkedin.com/in/ahmedbedair) |
| 🐙 **GitHub** | [github.com/bedairahmed](https://github.com/bedairahmed) |

### Need Help?

🙋 Raise your hand  
💬 Post in the workshop chat  
📧 Email for follow-up questions  

---

> 💡 **Remember:** This workshop is a starting point — not the finish line.  
> By the end, you'll have a solid foundation to continue your cloud learning journey with confidence.

---

**Made with ❤️ for the MCWS Community**  
*☁️ GCP Cloud Engineering Workshop*
