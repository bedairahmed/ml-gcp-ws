# ☁️ Madina Lab — GCP Cloud Workshop

![GCP](https://img.shields.io/badge/GCP-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

> **Hands-on Workshop** — Build a solution architecture on Google Cloud using a sample community application

---

## 📋 Workshop Overview

Using a sample community platform (chat, events, business directory) as our use case, we'll build a solution architecture on Google Cloud and deploy it using GCP services.

**3 labs. All hands-on.**

| | Lab | What You'll Do |
|---|---|---|
| 🔍 | **Lab 1** | Explore GCP services & understand the architecture |
| 🚀 | **Lab 2** | Build & deploy using containers and CI/CD pipelines |
| 🏗️ | **Lab 3** | Introduction to Infrastructure as Code |

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

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxQhQ5DcSui7mcSfXHVfUcVQpQWMklq4jzJzI1P9YLRgww02kMuk7HV3tdNUjxyJsYysvFosiCPy9J/pubhtml?gid=959209679&amp;single=true&amp;widget=true&amp;headers=false" width="100%" height="400" frameborder="0"></iframe>

| Setting | Value |
|---------|-------|
| **GCP Console** | [console.cloud.google.com](https://console.cloud.google.com) |
| **Project** | `ml-gcp-workshop-487117` |
| **Region** | `us-central1` |
| **Login** | `studentN@ml-gcp.cloud-people.net` |

### Team Roles

Each team has **two members**. Pick your roles and **switch between labs**:

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Drives keyboard, runs commands | Follows in Console, checks logs & metrics |

---

## 🧪 Labs

| Lab | Title | Duration | Guide |
|-----|-------|----------|-------|
| 0 | Credentials & Setup | 10 min | [labs/CREDENTIALS.md](labs/CREDENTIALS.md) |
| 1 | Explore Your Cloud & Meet the App | 30 min | [labs/LAB1.md](labs/LAB1.md) |
| 2 | Ship Your App | 35 min | [labs/LAB2.md](labs/LAB2.md) |
| 3 | Infrastructure as Code | 30 min | [labs/LAB3.md](labs/LAB3.md) |

---

## 📖 Cheatsheets

| Topic | Reference |
|-------|-----------|
| GCP CLI (gcloud) | [docs/gcloud-cheatsheet.md](docs/gcloud-cheatsheet.md) |
| Docker | [docs/docker-cheatsheet.md](docs/docker-cheatsheet.md) |
| Terraform | [docs/terraform-cheatsheet.md](docs/terraform-cheatsheet.md) |
| Cloud Build & CI/CD | [docs/cloudbuild-cheatsheet.md](docs/cloudbuild-cheatsheet.md) |
| YAML | [docs/yaml-cheatsheet.md](docs/yaml-cheatsheet.md) |
| Git | [docs/git-cheatsheet.md](docs/git-cheatsheet.md) |

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

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **Backend** | Firebase Auth + Firestore |
| **Container** | Docker multi-stage (Node.js build → nginx serve) |
| **CI/CD** | Google Cloud Build with Hadolint + Trivy scanning |
| **Hosting** | Google Cloud Run |
| **Secrets** | GCP Secret Manager |
| **IaC** | Terraform |

---

## ✨ Sample Application Features

| Feature | Description |
|---------|-------------|
| 🕐 **Prayer Times** | Real-time schedule via Aladhan API |
| 📅 **Community Events** | RSVP system, category filters |
| 💬 **Community Chat** | Group channels with mentions & reactions |
| 🏢 **Business Directory** | Listings with reviews & ratings |
| 🛡️ **Admin Panel** | User management, event moderation |
| 🌐 **Trilingual** | English, Arabic, Urdu with RTL support |
| 🌙 **Dark Mode** | Full dark/light theme toggle |

---

## 📁 Repository Structure

```
ml-gcp-ws/
├── README.md                   # This file
├── Dockerfile                  # Multi-stage Docker build (Lab 1, 2)
├── docker-compose.yml          # Local development
├── firebase.json               # Firebase config
├── firestore.rules             # Firestore security rules
├── package.json                # Node.js dependencies
│
├── .pipelines/                 # CI/CD pipeline definitions
│   ├── cloudbuild-app.yaml     # App build & deploy pipeline (Lab 2)
│   └── cloudbuild-tf.yaml      # Terraform pipeline (Lab 3)
│
├── labs/                       # Workshop lab guides
│   ├── CREDENTIALS.md
│   ├── LAB1.md
│   ├── LAB2.md
│   └── LAB3.md
│
├── docs/                       # Cheatsheets & reference
│   ├── gcloud-cheatsheet.md
│   ├── docker-cheatsheet.md
│   ├── terraform-cheatsheet.md
│   ├── cloudbuild-cheatsheet.md
│   ├── yaml-cheatsheet.md
│   └── git-cheatsheet.md
│
├── scripts/                    # Instructor scripts
│   ├── setup.sh                # Infrastructure provisioning
│   ├── cleanup.sh              # Resource cleanup
│   └── validate.sh             # Validation checks
│
├── terraform/                  # IaC files (Lab 3)
│   ├── main.tf
│   ├── cloud_run.tf
│   ├── iam.tf
│   ├── secrets.tf
│   ├── setup.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── terraform.tfvars.example
│
├── src/                        # React application source
└── public/                     # Static assets
```

---

## 🚀 Quick Start

### Deploy (Workshop — one command)

```bash
git clone https://github.com/bedairahmed/ml-gcp-ws.git
cd ml-gcp-ws
gcloud builds submit --config .pipelines/cloudbuild-app.yaml --substitutions=_TEAM=teamN .
```

### Local Development

```bash
npm install
npm run dev
# Visit http://localhost:8080
```

### Docker (Local)

```bash
docker compose up --build
# Visit http://localhost:8080
```

---

## 🔄 CI/CD Pipeline

The pipeline ([`cloudbuild-app.yaml`](.pipelines/cloudbuild-app.yaml)) runs 6 steps:

| Step | Name | What |
|------|------|------|
| 1 | `lint-dockerfile` | Hadolint — Dockerfile best practices |
| 2 | `build` | Docker build with secrets from Secret Manager |
| 3 | `scan-image` | Trivy — container vulnerability scan |
| 4 | `push` | Push image to Artifact Registry |
| 5 | `deploy-app` | Deploy to Cloud Run |
| 6 | `allow-public-access` | Grant public access |

---

## 🔀 Team Isolation

| What | How |
|------|-----|
| **Service name** | `madina-lab-team1`, `madina-lab-team2`, etc. |
| **Data namespace** | `VITE_NAMESPACE=team1` → `team1_users`, `team1_events` |
| **Service account** | `team1-sa@ml-gcp-workshop-487117.iam.gserviceaccount.com` |
| **Container image** | `madina-lab-team1:latest` in Artifact Registry |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Permission denied` on Cloud Build | Ask instructor — IAM roles may be missing |
| Build fails `secret not found` | Verify: `gcloud secrets list` |
| Blank page after deploy | Check: Console → Cloud Run → Logs |
| Firebase auth popup blocked | Add Cloud Run URL to Firebase authorized domains |
| `memory < 512Mi` error | Ensure `--cpu-throttling` is in deploy step |

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
| [GCP CLI (gcloud)](docs/gcloud-cheatsheet.md) | Cloud Run, Cloud Build, Secret Manager, IAM commands |
| [Docker](docs/docker-cheatsheet.md) | Images, containers, compose, multi-stage builds |
| [Terraform](docs/terraform-cheatsheet.md) | Init, plan, apply, HCL syntax, state management |
| [Cloud Build & CI/CD](docs/cloudbuild-cheatsheet.md) | Pipeline YAML structure, security scanning |
| [YAML](docs/yaml-cheatsheet.md) | Syntax, substitutions, Cloud Build YAML |
| [Git](docs/git-cheatsheet.md) | Clone, commit, push, branches, .gitignore |

---

## 📞 Workshop Instructor

**Ahmed Bedair**
Senior Cloud Architect

| | |
|---|---|
| 📧 Email | abedair@gmail.com |
| 💼 LinkedIn | [linkedin.com/in/ahmedbedair](https://linkedin.com/in/ahmedbedair) |
| 🐙 GitHub | [github.com/bedairahmed](https://github.com/bedairahmed) |

### Need Help?

🙋 Raise your hand · 💬 Workshop chat · 📧 Email for follow-up

---

> 💡 *This workshop is a starting point — not the finish line. By the end, you'll have a solid foundation to continue your cloud learning journey with confidence.*

---

<div align="center">

**Made with ❤️ for the MCWS Community**

*☁️ GCP Cloud Workshop — Feb 15, 2026*

</div>