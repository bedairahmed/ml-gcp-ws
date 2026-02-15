# 🕌 Madina Lab — Lab 1: Explore Your Cloud & Meet the App

> *A growing community needs a platform. Before building anything, understand the cloud services that power it.*

---

## 🎯 Objectives

- Navigate the GCP Console and identify workshop services
- See the live app and understand its architecture
- Read the Dockerfile and pipeline before running anything

## ⏱ Duration: 30 minutes

## 👥 Roles

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Navigates Console | Takes notes, answers discussion questions |

📖 Cheatsheet: [`docs/gcloud-cheatsheet.md`](../docs/gcloud-cheatsheet.md)

---

## Part A: GCP Services Tour (15 min)

Log into GCP Console → project: **ml-gcp-workshop-487117** *(see [credentials.md](credentials.md))*

### Task 1: VPC Network

📍 [**Open VPC Networks →**](https://console.cloud.google.com/networking/networks/list?project=ml-gcp-workshop-487117) → click `madina-lab-vpc`

> ❓ What subnet? What IP range? How many firewall rules?

### Task 2: Artifact Registry

📍 [**Open Artifact Registry →**](https://console.cloud.google.com/artifacts?project=ml-gcp-workshop-487117) → click `madina-lab`

> ❓ What type of repo? Can you find the instructor's image?

### Task 3: Secret Manager

📍 [**Open Secret Manager →**](https://console.cloud.google.com/security/secret-manager?project=ml-gcp-workshop-487117)

> ❓ How many secrets? Can you see the values?

### Task 4: Cloud Build

📍 [**Open Cloud Build History →**](https://console.cloud.google.com/cloud-build/builds?project=ml-gcp-workshop-487117) — find the instructor's build, expand each step

> ❓ How many steps? How long? What does each step do?

### Task 5: Cloud Run

📍 [**Open Cloud Run →**](https://console.cloud.google.com/run?project=ml-gcp-workshop-487117) → click `madina-lab-instructor` → explore: Metrics, Logs, Revisions, Security, Variables & Secrets

> ❓ What URL? How many instances? What service account?

### Task 6: Firestore

📍 [**Open Firestore →**](https://console.cloud.google.com/firestore?project=ml-gcp-workshop-487117) — check Data tab and Rules tab

> ❓ What collections? Where are security rules defined?

---

## Part B: Meet the App & Pipeline (15 min)

### Task 7: Visit the Live App

Copy the Cloud Run URL from Task 5. Sign up, explore chat, events, business directory.

> ❓ How would each feature use Firestore?

### Task 8: Read the Dockerfile

📍 **Open:** [`Dockerfile`](../Dockerfile)
- VS Code: `ml-gcp-ws/Dockerfile`
- GitHub: [view on GitHub](https://github.com/bedairahmed/ml-gcp-ws/blob/main/Dockerfile)

> ❓ How many stages? What does each do? What port? What is `/health` for?

**Key things:**
- Stage 1 (`node:20-alpine`) — builds the React app
- Stage 2 (`nginx:alpine`) — serves built files
- Port `8080` — Cloud Run requirement
- `/health` — startup probe endpoint

📖 See [`docs/docker-cheatsheet.md`](../docs/docker-cheatsheet.md)

### Task 9: Read the Pipeline

📍 **Open:** [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml)
- VS Code: `ml-gcp-ws/.pipelines/cloudbuild-app.yaml`
- GitHub: [view on GitHub](https://github.com/bedairahmed/ml-gcp-ws/blob/main/.pipelines/cloudbuild-app.yaml)

> ❓ How many steps? Which builds? Which scans? Where are secrets? What does `_TEAM` do?

| Step | Name | What it does |
|------|------|-------------|
| 1 | `lint-dockerfile` | Hadolint — Dockerfile best practices |
| 2 | `build` | Docker build with secrets |
| 3 | `scan-image` | Trivy — vulnerability scan |
| 4 | `push` | Push to Artifact Registry |
| 5 | `deploy-app` | Deploy to Cloud Run |
| 6 | `allow-public-access` | Grant public access |
| 7 | `map-domain` | Map custom domain |

📖 See [`docs/cloudbuild-cheatsheet.md`](../docs/cloudbuild-cheatsheet.md)

---

## 💬 Discussion

1. Why Cloud Run instead of a VM?
2. Why Secret Manager instead of `.env` in the repo?
3. Why scan the container before deploying?

## ✅ Checklist

- [ ] Logged into [GCP Console](https://console.cloud.google.com/?project=ml-gcp-workshop-487117)
- [ ] Explored: VPC, Artifact Registry, Secret Manager, Cloud Build, Cloud Run, Firestore
- [ ] Visited the live app
- [ ] Read the Dockerfile — understand two stages
- [ ] Read the pipeline — identify each step

---
