# 🕌 Madina Lab

**Your Digital Community Companion**  
A trilingual community platform for the Muslim Community of Western Suburbs (MCWS), Canton, MI.

**Instructor:** Ahmed Bedair | GCP Cloud Engineering Workshop

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🕐 **Prayer Times** | Real-time prayer schedule via the Aladhan API (ISNA method) |
| 🌤️ **Weather Widget** | Live weather for Canton, MI via Open-Meteo API |
| 📿 **Athkar Tracker** | Morning & evening adhkar with tap counters, streak tracking |
| 📅 **Community Events** | RSVP system, category filters, admin event creation |
| 💬 **Community Chat** | Group channels with @mentions, reactions, reply threads (Firestore real-time) |
| 🏢 **Business Directory** | Muslim-owned business listings with reviews, ratings, claim/verify workflow |
| 🏪 **My Business** | Business owners manage listings, respond to reviews, update hours |
| 🛡️ **Admin Panel** | User management, event moderation, claim approvals, announcement editor |
| 🔔 **Notifications** | In-app notifications for reviews, claim approvals, announcements |
| ❓ **Help & FAQ** | Searchable help center with categorized FAQ |
| 🌐 **Trilingual** | English, Arabic, Urdu with full RTL support |
| 🌙 **Dark Mode** | Full dark/light theme toggle |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **UI** | Tailwind CSS, shadcn/ui, Lucide Icons, Framer Motion |
| **Backend** | Firebase (Auth, Firestore) |
| **APIs** | Aladhan (prayer times), Open-Meteo (weather) |
| **Containerization** | Docker (multi-stage: Node.js → nginx) |
| **CI/CD** | Google Cloud Build |
| **Hosting** | Google Cloud Run |
| **Secrets** | GCP Secret Manager |
| **IaC** | Terraform |

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

## 📂 Project Structure

```
src/
├── components/
│   ├── admin/          # Admin panel tabs (UserManagement, EventModeration, etc.)
│   ├── chat/           # Chat UI (GroupList, MessageBubble, MessageComposer)
│   ├── directory/      # Business cards, detail dialog, star ratings
│   ├── events/         # Event cards, category filters, add event dialog
│   ├── home/           # Prayer times, weather, welcome banner
│   ├── layout/         # Header, BottomNav, Sidebar, NotificationBell
│   └── ui/             # shadcn/ui components
├── contexts/           # Auth, Language, Theme providers
├── data/               # Sample data, translations, athkar
├── hooks/              # useChat, useEvents, useAdmin, useDirectory, useNotifications
├── lib/                # Utilities, notification helpers
├── pages/              # Route pages (Home, Events, Chat, Directory, Admin, Help, etc.)
└── config/             # Firebase configuration
terraform/              # GCP infrastructure as code
```

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

### Prerequisites

- GCP account with billing enabled
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed
- [Terraform](https://developer.hashicorp.com/terraform/downloads) installed
- [Docker](https://docs.docker.com/get-docker/) installed

### 1. Enable APIs

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

### 2. Configure IAM

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

### 3. Create Secrets

```bash
echo -n "YOUR_API_KEY" | gcloud secrets create firebase-api-key --data-file=-
echo -n "your-project.firebaseapp.com" | gcloud secrets create firebase-auth-domain --data-file=-
echo -n "your-project-id" | gcloud secrets create firebase-project-id --data-file=-
echo -n "your-project.appspot.com" | gcloud secrets create firebase-storage-bucket --data-file=-
echo -n "123456789" | gcloud secrets create firebase-messaging-sender-id --data-file=-
echo -n "1:123456789:web:abcdef" | gcloud secrets create firebase-app-id --data-file=-
```

### 4. Deploy

```bash
# Option A: Cloud Build
gcloud builds submit --config cloudbuild.yaml .

# Option B: Terraform
cd terraform
cp terraform.tfvars.example terraform.tfvars
terraform init && terraform apply
```

---

## 🔥 Firebase Setup

1. [Firebase Console](https://console.firebase.google.com/) → Add/select your GCP project
2. **Authentication** → Enable Google provider → Add authorized domains
3. **Firestore** → Create database in production mode (us-central1)
4. Deploy security rules: `firebase deploy --only firestore:rules`

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

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Permission denied` on Cloud Build | Re-run IAM commands above |
| Build fails with `secret not found` | Verify: `gcloud secrets list` |
| Blank page after deploy | Check logs: `gcloud run services logs read madina-lab` |
| Firebase auth popup blocked | Add Cloud Run domain to Firebase authorized domains |
| Docker build fails locally | Ensure Node.js 20+ and run `npm install` first |

### Useful Commands

```bash
gcloud config get-value project          # Check active project
gcloud services list --enabled           # Check enabled APIs
gcloud run services list                 # List Cloud Run services
curl https://YOUR_URL/health             # Test health endpoint
```

---

## 📚 Resources

- [Cloud Build Docs](https://cloud.google.com/build/docs)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [Secret Manager Docs](https://cloud.google.com/secret-manager/docs)
- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

**Built with ❤️ for the MCWS community**  
**Instructor:** Ahmed Bedair | GCP Cloud Engineering Workshop
