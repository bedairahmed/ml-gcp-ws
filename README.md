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

---

## 🧪 Labs

| Lab | Title | Duration | Guide |
|-----|-------|----------|-------|
| 0 | Credentials & Setup | 10 min | [labs/credentials.md](labs/credentials.md) |
| 1 | Explore Your Cloud & Meet the App | 30 min | [labs/lab1.md](labs/lab1.md) |
| 2 | Ship Your App | 35 min | [labs/lab2.md](labs/lab2.md) |
| 3 | Infrastructure as Code | 30 min | [labs/lab3.md](labs/lab3.md) |

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

## 🔄 CI/CD Pipelines

### App Pipeline ([`.pipelines/cloudbuild-app.yaml`](.pipelines/cloudbuild-app.yaml)) — 6 steps

| Step | Name | What |
|------|------|------|
| 1 | `lint-dockerfile` | Hadolint — Dockerfile best practices |
| 2 | `build` | Docker build with secrets from Secret Manager |
| 3 | `scan-image` | Trivy — container vulnerability scan |
| 4 | `push` | Push image to Artifact Registry |
| 5 | `deploy-app` | Deploy to Cloud Run |
| 6 | `allow-public-access` | Grant public access |

### Terraform Pipeline ([`.pipelines/cloudbuild-tf.yaml`](.pipelines/cloudbuild-tf.yaml)) — 5 steps

| Step | Name | What |
|------|------|------|
| 1 | `build-app` | Build & push container image |
| 2 | `checkov-scan` | Checkov — Terraform security scan |
| 3 | `tf-init` | Download providers |
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
│   ├── credentials.md
│   ├── lab1.md
│   ├── lab2.md
│   └── lab3.md
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
│   ├── setup.sh
│   ├── cleanup.sh
│   └── validate.sh
│
├── terraform/                  # IaC files (Lab 3)
│   ├── main.tf
│   ├── cloud_run.tf
│   ├── iam.tf
│   ├── secrets.tf
│   ├── variables.tf
│   ├── outputs.tf
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

---

## 📞 Workshop Instructor

**Ahmed Bedair** — Senior Cloud Architect

📧 abedair@gmail.com · 💼 [LinkedIn](https://linkedin.com/in/ahmedbedair) · 🐙 [GitHub](https://github.com/bedairahmed)

🙋 Raise your hand · 💬 Workshop chat · 📧 Email for follow-up

---

<div align="center">

**Made with ❤️ for the MCWS Community**

*☁️ GCP Cloud Workshop — Feb 15, 2026*

</div>