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

*(See [CREDENTIALS.md](CREDENTIALS.md) for login details)*

---

### Task 1: VPC Network

📍 **Console → VPC Network → VPC Networks → `madina-lab-vpc`**

Click into it. Explore the subnet and firewall rules.

> ❓ What subnet is attached? What IP range? How many firewall rules?

---

### Task 2: Artifact Registry

📍 **Console → Artifact Registry → `madina-lab`**

Click into the repository.

> ❓ What type of repository is this? Can you find the instructor's image?

---

### Task 3: Secret Manager

📍 **Console → Security → Secret Manager**

Browse the list of secrets.

> ❓ How many secrets exist? Can you see the actual values? What kind of config is stored here?

---

### Task 4: Cloud Build

📍 **Console → Cloud Build → History**

Find the instructor's most recent build. Click into it and expand each step.

> ❓ How many steps? How long did it take? What does each step do?

---

### Task 5: Cloud Run

📍 **Console → Cloud Run → `madina-lab-instructor`**

Explore these tabs:
- **Metrics** — requests, latency, errors
- **Logs** — container output
- **Revisions** — deployment history
- **Security** — who can access?
- **Variables & Secrets** — Secret Manager references

> ❓ What URL is assigned? How many instances running? What service account is attached?

---

### Task 6: Firestore

📍 **Console → Firestore**

Check the Data tab and the Rules tab.

> ❓ What collections exist? Where are the security rules defined?

---

## Part B: Meet the App & Pipeline (15 min)

### Task 7: Visit the Live App

Copy the Cloud Run URL from Task 5 and open it in a new tab.

- Sign up with your workshop email
- Explore: chat, events, business directory

> ❓ How would each feature use Firestore?

---

### Task 8: Read the Dockerfile

📍 **Open in repo:** [`Dockerfile`](../Dockerfile)

Read through it and answer:

> ❓ How many stages? What does Stage 1 do? What does Stage 2 do? What port? What is `/health` for?

**Key things to notice:**
- Stage 1 (`node:20-alpine`) — installs dependencies and builds the React app
- Stage 2 (`nginx:alpine`) — copies the built files and serves them
- Port `8080` — Cloud Run requirement
- `/health` endpoint — Cloud Run uses this to check if the container is healthy

📖 *Need help with Docker concepts?* See [`docs/docker-cheatsheet.md`](../docs/docker-cheatsheet.md)

---

### Task 9: Read the Pipeline

📍 **Open in repo:** [`cloudbuild-app.yaml`](../cloudbuild-app.yaml)

Read through each step and answer:

> ❓ How many steps? Which step builds the image? Which step scans for vulnerabilities? Where are secrets injected? What does `_TEAM` control?

**Pipeline steps at a glance:**

| Step | Name | What it does |
|------|------|-------------|
| 1 | `lint-dockerfile` | Hadolint checks Dockerfile for best practices |
| 2 | `build` | Docker build with secrets from Secret Manager |
| 3 | `scan-image` | Trivy scans for CVEs (vulnerabilities) |
| 4 | `push` | Push image to Artifact Registry |
| 5 | `deploy-app` | Deploy to Cloud Run |
| 6 | `allow-public-access` | Make app accessible to everyone |

📖 *Need help with pipeline concepts?* See [`docs/cloudbuild-cheatsheet.md`](../docs/cloudbuild-cheatsheet.md)

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
- [ ] Read [`Dockerfile`](../Dockerfile) — understand the two stages
- [ ] Read [`cloudbuild-app.yaml`](../cloudbuild-app.yaml) — can identify each step