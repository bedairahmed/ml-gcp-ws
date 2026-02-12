# 🕌 Madina Lab — Lab 1: Explore Your Cloud & Meet the App

> *A growing community needs a platform. Before building anything, understand the cloud services that power it and see the application running live.*

---

## 🎯 Objectives

- Navigate the GCP Console and identify the services used in this workshop
- See the live application and understand its architecture
- Read the Dockerfile and pipeline before running anything

## ⏱ Duration: 30 minutes

## 👥 Roles

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Navigates Console, clicks into services | Takes notes, answers discussion questions |
| Opens repo files | Compares Console vs code |

## 📖 Helpful Cheatsheet: [`docs/gcloud-cheatsheet.md`](../docs/gcloud-cheatsheet.md)

---

## Part A: GCP Services Tour (15 min)

Log into the GCP Console → project: **ml-gcp-workshop-487117**

*(See [credentials.md](credentials.md) for login details)*

---

### Task 1: VPC Network

📍 **Console → VPC Network → VPC Networks → `madina-lab-vpc`**

> ❓ What subnet is attached? What IP range? How many firewall rules?

---

### Task 2: Artifact Registry

📍 **Console → Artifact Registry → `madina-lab`**

> ❓ What type of repository? Can you find the instructor's image?

---

### Task 3: Secret Manager

📍 **Console → Security → Secret Manager**

> ❓ How many secrets? Can you see the values? What kind of config is stored?

---

### Task 4: Cloud Build

📍 **Console → Cloud Build → History**

Find the instructor's build. Click into it and expand each step.

> ❓ How many steps? How long did it take? What does each step do?

---

### Task 5: Cloud Run

📍 **Console → Cloud Run → `madina-lab-instructor`**

Explore: **Metrics**, **Logs**, **Revisions**, **Security**, **Variables & Secrets**

> ❓ What URL is assigned? How many instances? What service account?

---

### Task 6: Firestore

📍 **Console → Firestore**

> ❓ What collections exist? Where are the security rules?

---

## Part B: Meet the App & Pipeline (15 min)

### Task 7: Visit the Live App

Copy the Cloud Run URL from Task 5 and open it.

- Sign up, explore chat, events, business directory

> ❓ How would each feature use Firestore?

---

### Task 8: Read the Dockerfile

📍 **Open in repo:** [`Dockerfile`](../Dockerfile)

> ❓ How many stages? What does each stage do? What port? What is `/health` for?

**Key things:**
- Stage 1 (`node:20-alpine`) — builds the React app
- Stage 2 (`nginx:alpine`) — serves the built files
- Port `8080` — Cloud Run requirement
- `/health` — Cloud Run health check

📖 See [`docs/docker-cheatsheet.md`](../docs/docker-cheatsheet.md)

---

### Task 9: Read the Pipeline

📍 **Open in repo:** [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml)

> ❓ How many steps? Which builds? Which scans? Where are secrets? What does `_TEAM` do?

| Step | Name | What it does |
|------|------|-------------|
| 1 | `lint-dockerfile` | Hadolint — Dockerfile best practices |
| 2 | `build` | Docker build with secrets from Secret Manager |
| 3 | `scan-image` | Trivy — vulnerability scan (CVEs) |
| 4 | `push` | Push image to Artifact Registry |
| 5 | `deploy-app` | Deploy to Cloud Run |
| 6 | `allow-public-access` | Grant public access |

📖 See [`docs/cloudbuild-cheatsheet.md`](../docs/cloudbuild-cheatsheet.md)

---

## 💬 Discussion

1. Why Cloud Run instead of a VM?
2. Why Secret Manager instead of a `.env` file in the repo?
3. Why scan the container before deploying?

---

## ✅ Checklist

- [ ] Logged into GCP Console
- [ ] Explored: VPC, Artifact Registry, Secret Manager, Cloud Build, Cloud Run, Firestore
- [ ] Visited the live app
- [ ] Read [`Dockerfile`](../Dockerfile) — understand two stages
- [ ] Read [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml) — identify each step