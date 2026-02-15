# ☁️ Madina Lab — GCP Cloud Workshop

![GCP](https://img.shields.io/badge/GCP-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

> **Hands-on Workshop** — Deploy a community platform on Google Cloud
## 🤖 AI Workshop Assistant

Stuck on a command? Getting an error? Ask the AI assistant — it knows all the labs, cheatsheets, and pipeline configs.

**[→ Open ML GCP Workshop Assistant](https://chatgpt.com/g/g-6991d00ab97c8191a1c1cbc4e1f23da1-ml-gcp-workshop-assistant)**

Try asking:
- "I'm getting a permission denied error in Lab 2"
- "What does Trivy do and why do we use it?"
- "How do I check if my Cloud Run service is running?"
- "Explain the difference between Lab 2 and Lab 3"
- "What is a multi-stage Docker build?"
- "How do I see my Terraform state?"
- "What GCP services are we using in this workshop?"
- "Help me understand the CI/CD pipeline steps"

---
---

## 📋 Workshop Overview

Using a sample community platform (chat, events, business directory) as our use case, we'll deploy on Google Cloud and learn GCP services hands-on.

**3 labs. All hands-on.**

| | Lab | What You'll Do |
|---|---|---|
| 🔍 | **Lab 1** | Explore GCP services & understand the architecture |
| 🚀 | **Lab 2** | Build & deploy using containers and CI/CD pipelines |
| 🏗️ | **Lab 3** | Introduction to Infrastructure as Code |

---

## 🎯 The Business Case

📄 [**Read the full business case →**](labs/business-case.md)

The **Muslim Community of the West Side (MCWS)** needs a unified platform to replace scattered WhatsApp groups and Google Forms. The dev team built the app. **You are the cloud team — deploy it securely on GCP.**

| # | Requirement | How You'll Deliver |
|---|------------|-------------------|
| 1 | Each team deploys independently | `_TEAM` variable → isolated services, data, and state |
| 2 | No hardcoded secrets | Secret Manager → injected at build time |
| 3 | Security scanning before deploy | Hadolint + Trivy (containers) + Checkov (infra) |
| 4 | One-command deployment | CI/CD pipeline — `gcloud builds submit` |
| 5 | Scales to zero when idle | Cloud Run — `min-instances=0` |
| 6 | Infrastructure as Code | Terraform — deploy 1 team or 50 with the same code |
| 7 | Monitoring built-in | Cloud Run logs, metrics, and health checks |

---

## 🕌 The Application — Madina Lab

Madina Lab is a **production-ready trilingual community platform** built for the MCWS Canton community. It serves as both a real community tool and the sample application for this workshop.

🔗 [**Live Demo**](https://instructor.lab.ml-gcp.cloud-people.net) · [Cloud Run URL](https://madina-lab-instructor-202948511064.us-central1.run.app) — See the deployed application

### Features

| Feature | Description |
|---------|-------------|
| 🕐 **Prayer Times** | Real-time prayer schedule via Aladhan API (ISNA method) |
| 🌤️ **Weather Widget** | Live weather for Canton, MI via Open-Meteo API |
| 📿 **Athkar Tracker** | Morning & evening adhkar with tap counters and streak tracking |
| 📅 **Community Events** | RSVP system, category filters, admin event creation |
| 💬 **Community Chat** | Group channels with @mentions, reactions, reply threads |
| 🏢 **Business Directory** | Listings with reviews, ratings, claim/verify workflow |
| 🏪 **My Business** | Business owners manage listings, respond to reviews |
| 🛡️ **Admin Panel** | User management, event moderation, claim approvals |
| 🔔 **Notifications** | In-app notifications for reviews, claims, announcements |
| ❓ **Help & FAQ** | Searchable help center with categorized FAQ |
| 🌐 **Trilingual** | English, Arabic, Urdu with full RTL support |
| 🌙 **Dark Mode** | Full dark/light theme toggle |

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, TypeScript, Vite | UI framework & build tooling |
| **UI** | Tailwind CSS, shadcn/ui, Lucide Icons | Styling & components |
| **Backend** | Firebase Auth + Firestore | Authentication & real-time database |
| **APIs** | Aladhan, Open-Meteo | Prayer times & weather data |
| **Container** | Docker (multi-stage) | Node.js build → nginx serve |
| **CI/CD** | Google Cloud Build | Automated build, scan & deploy |
| **Hosting** | Google Cloud Run | Serverless container hosting |
| **Secrets** | GCP Secret Manager | Secure credential storage |
| **IaC** | Terraform | Infrastructure automation |

### User Roles

| Role | Access |
|------|--------|
| `admin` | Full platform control, user management, claim approvals |
| `moderator` | Event moderation, content management |
| `business` | Business listing management, review responses |
| `member` | Standard community access |

### Firestore Collections

| Collection | Purpose |
|-----------|---------|
| `users` | User profiles with roles, language, groups |
| `groups` / `chat_messages` | Chat channels and messages |
| `events` | Community events with RSVPs |
| `businesses` / `businesses/{id}/reviews` | Directory listings and reviews |
| `business_claims` | Business claim requests |
| `notifications` | In-app user notifications |
| `announcements` | Admin announcements |
| `direct_messages` | Private messaging |

### Namespace Isolation (Workshop Mode)

Each team sets `VITE_NAMESPACE` to isolate their data in the shared Firestore:

| Without namespace | With `VITE_NAMESPACE=team1` |
|---|---|
| `users` | `team1_users` |
| `events` | `team1_events` |
| `businesses` | `team1_businesses` |
| `notifications` | `team1_notifications` |
| `chat_messages` | `team1_chat_messages` |

---

## 📅 Schedule

| Time | Type | Topic |
|------|------|-------|
| 2:15 – 2:25 | Setup | Welcome, login, team assignments |
| 2:25 – 2:40 | 🎤 Talk | Cloud basics, GCP services, containers |
| 2:40 – 3:10 | 💻 Lab 1 | Explore GCP Console & meet the app |
| 3:10 – 3:25 | 🎤 Talk | CI/CD, pipelines, Dockerfile, security |
| 3:25 – 4:00 | 💻 Lab 2 | Deploy, scan, monitor |
| 4:00 – 4:10 | ☕ Break | |
| 4:10 – 4:25 | 🎤 Talk | IaC, Terraform, imperative vs declarative |
| 4:25 – 4:55 | 💻 Lab 3 | Terraform pipeline |
| 4:55 – 5:00 | 🎤 | Wrap-up & Q&A |

---

## 🔐 Student Access

📋 [**Workshop Registration Sheet**](https://docs.google.com/spreadsheets/d/e/2PACX-1vSxQhQ5DcSui7mcSfXHVfUcVQpQWMklq4jzJzI1P9YLRgww02kMuk7HV3tdNUjxyJsYysvFosiCPy9J/pubhtml?gid=959209679&single=true) — Find your team, email, and password here.



| Setting | Value |
|---------|-------|
| **GCP Console** | [console.cloud.google.com](https://console.cloud.google.com) |
| **Project** | `ml-gcp-workshop-487117` |
| **Region** | `us-central1` |
| **Login** | `studentN@ml-gcp.cloud-people.net` |

---



## 🧪 Labs

| Lab | Title | Duration | Guide | Quiz |
|-----|-------|----------|-------|------|
| — | The Business Case | 5 min read | [labs/business-case.md](labs/business-case.md) | |
| 0 | Credentials & Setup | 10 min | [labs/credentials.md](labs/credentials.md) | |
| 1 | Explore Your Cloud & Meet the App | 30 min | [labs/lab1.md](labs/lab1.md) | [Quiz 1](labs/quizzes/quiz1.md) |
| 2 | Ship Your App | 35 min | [labs/lab2.md](labs/lab2.md) | [Quiz 2](labs/quizzes/quiz2.md) |
| 3 | Infrastructure as Code | 30 min | [labs/lab3.md](labs/lab3.md) | [Quiz 3](labs/quizzes/quiz3.md) |

---

## 🏛️ Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   GitHub     │────▶│ Cloud Build  │────▶│   Cloud Run      │
│   (Source)   │     │ (CI/CD)      │     │   (Hosting)      │
└─────────────┘     └──────┬───────┘     └──────────────────┘
                           │
                    ┌──────▼───────┐     ┌──────────────────┐
                    │  Artifact    │     │  Secret Manager  │
                    │  Registry    │     │  (API Keys)      │
                    └──────────────┘     └──────────────────┘

                    ┌──────────────────────────────────────┐
                    │       Firebase / Firestore            │
                    │   (Auth, Database, Real-time Sync)    │
                    └──────────────────────────────────────┘
```

### GCP Services Used

| Service | Purpose |
|---------|---------|
| **Cloud Run** | Serverless container hosting — scales to zero |
| **Cloud Build** | CI/CD pipeline — automated build, scan & deploy |
| **Artifact Registry** | Docker image storage — versioned, scannable |
| **Secret Manager** | Secure storage for API keys & config |
| **VPC Network** | Private network with subnet & firewall rules |
| **Firestore** | NoSQL real-time database |
| **Firebase Auth** | User authentication (email + Google sign-in) |
| **Cloud Storage** | Terraform state backend (per-team isolation) |

---

## 🔄 CI/CD Pipelines

### App Pipeline ([`.pipelines/cloudbuild-app.yaml`](.pipelines/cloudbuild-app.yaml)) — 7 steps

| Step | Name | What |
|------|------|------|
| 1 | `lint-dockerfile` | Hadolint — Dockerfile best practices |
| 2 | `build` | Docker build with secrets from Secret Manager |
| 3 | `scan-image` | Trivy — container vulnerability scan |
| 4 | `push` | Push image to Artifact Registry |
| 5 | `deploy-app` | Deploy to Cloud Run |
| 6 | `allow-public-access` | Grant public access |
| 7 | `map-domain` | Map custom domain |

### Terraform Pipeline ([`.pipelines/cloudbuild-tf.yaml`](.pipelines/cloudbuild-tf.yaml)) — 5 steps

| Step | Name | What |
|------|------|------|
| 1 | `build-app` | Build & push container image |
| 2 | `checkov-scan` | Checkov — Terraform security scan |
| 3 | `tf-init` | Download providers + per-team state backend |
| 4 | `tf-plan` | Preview changes |
| 5 | `tf-apply` | Create/update resources |

---

## 📁 Repository Structure

```
ml-gcp-ws/
├── README.md                   # This file
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Local development
├── firebase.json               # Firebase config
├── firestore.rules             # Firestore security rules
├── package.json                # Node.js dependencies
│
├── .pipelines/                 # CI/CD pipeline definitions
│   ├── cloudbuild-app.yaml     # App build & deploy (Lab 2)
│   └── cloudbuild-tf.yaml      # Terraform pipeline (Lab 3)
│
├── labs/                       # Workshop lab guides
│   ├── business-case.md        # The scenario & requirements
│   ├── credentials.md
│   ├── lab1.md
│   ├── lab2.md
│   ├── lab3.md
│   └── quizzes/                # Quick knowledge checks
│       ├── quiz1.md
│       ├── quiz2.md
│       └── quiz3.md
│
├── docs/                       # Cheatsheets & reference
│   ├── gcloud-cheatsheet.md
│   ├── docker-cheatsheet.md
│   ├── terraform-cheatsheet.md
│   ├── cloudbuild-cheatsheet.md
│   ├── yaml-cheatsheet.md
│   ├── git-cheatsheet.md
│   └── cloudshell-cheatsheet.md
│
├── scripts/                    # Instructor scripts
│   ├── setup.sh
│   ├── cleanup.sh
│   ├── cleanup-lab3-prep.sh    # Delete team services before Lab 3
│   └── validate.sh
│
├── terraform/                  # IaC files (Lab 3)
│   ├── provider.tf             # Provider & GCS backend
│   ├── main.tf                 # Data sources & locals
│   ├── cloud_run.tf            # Cloud Run service
│   ├── iam.tf                  # IAM bindings
│   ├── secrets.tf              # Secret Manager
│   ├── variables.tf            # Input variables
│   ├── outputs.tf              # Output values
│   └── terraform.tfvars.example
│
├── src/                        # React application source
└── public/                     # Static assets
```

---

## 🚀 Quick Start

### Deploy (Workshop)

```bash
git clone https://github.com/bedairahmed/ml-gcp-ws.git
cd ml-gcp-ws
gcloud builds submit --config .pipelines/cloudbuild-app.yaml --substitutions=_TEAM=teamN .
```

### Local Development

```bash
npm install && npm run dev
# Visit http://localhost:8080
```

---

## 📚 Resources

### GCP Documentation

| Resource | Link |
|----------|------|
| Cloud Build Docs | [cloud.google.com/build/docs](https://cloud.google.com/build/docs) |
| Cloud Run Docs | [cloud.google.com/run/docs](https://cloud.google.com/run/docs) |
| Secret Manager | [cloud.google.com/secret-manager/docs](https://cloud.google.com/secret-manager/docs) |
| Terraform GCP | [registry.terraform.io/providers/hashicorp/google](https://registry.terraform.io/providers/hashicorp/google/latest/docs) |
| Firebase Docs | [firebase.google.com/docs](https://firebase.google.com/docs) |
| Docker Multi-stage | [docs.docker.com/build/building/multi-stage](https://docs.docker.com/build/building/multi-stage/) |

### Workshop Cheatsheets

| Cheatsheet | Description |
|-----------|-------------|
| [GCP CLI (gcloud)](docs/gcloud-cheatsheet.md) | Cloud Run, Cloud Build, Secret Manager, IAM |
| [Docker](docs/docker-cheatsheet.md) | Images, containers, compose, multi-stage |
| [Terraform](docs/terraform-cheatsheet.md) | Init, plan, apply, HCL syntax |
| [Cloud Build & CI/CD](docs/cloudbuild-cheatsheet.md) | Pipeline YAML, security scanning |
| [YAML](docs/yaml-cheatsheet.md) | Syntax, substitutions, Cloud Build YAML |
| [Git](docs/git-cheatsheet.md) | Clone, commit, push, branches |
| [Cloud Shell](docs/cloudshell-cheatsheet.md) | Terminal, editor, shortcuts, troubleshooting |
| [🤖 AI Workshop Assistant](https://chatgpt.com/g/g-6991d00ab97c8191a1c1cbc4e1f23da1-ml-gcp-workshop-assistant) | Ask questions, get help with errors, learn concepts |

---

## 📝 Workshop Feedback

📋 [**Submit Feedback**](https://github.com/bedairahmed/ml-gcp-ws/issues/new?template=workshop-feedback.yml) — Help us improve future workshops!

---

## 📞 Workshop Instructor

**Ahmed Bedair** — Senior Cloud Architect

📧 abedair@gmail.com · 💼 [LinkedIn](https://linkedin.com/in/abedair) · 🐙 [GitHub](https://github.com/bedairahmed)

🙋 Raise your hand · 💬 Workshop chat · 📧 Email for follow-up

---

<div align="center">

**Made with ❤️ for the MCWS Community**

*☁️ GCP Cloud Workshop — Feb 15, 2026*

</div>