# 🕌 Madina Lab — The Business Case

> *You are the cloud team. The community is counting on you.*

---

## The Situation

The **Muslim Community of the West Side (MCWS)** in Canton, Michigan has been growing rapidly. Members coordinate through scattered WhatsApp groups, Google Forms, and paper sign-ups. The community board has approved building a **unified community platform** — Madina Lab — to handle:

- 🕐 Prayer times & daily athkar tracking
- 📅 Community events with RSVP
- 💬 Group chat channels
- 🏢 A local Muslim business directory
- 🌐 Trilingual support (English, Arabic, Urdu)

The development team has already built the application. **Your job as the cloud team is to get it running on Google Cloud — securely, reliably, and repeatably.**

---

## The Requirements

The community board and the development team have given you these requirements:

| # | Requirement | Why |
|---|------------|-----|
| 1 | **Each team deploys independently** | 8 teams are working in parallel — they can't step on each other |
| 2 | **No hardcoded secrets** | API keys must never appear in code or Git history |
| 3 | **Security scanning before deploy** | Community data (members, businesses) must be protected |
| 4 | **One-command deployment** | Volunteers run this — it must be simple and repeatable |
| 5 | **Scales to zero when idle** | The community can't afford to pay for idle servers |
| 6 | **Infrastructure as Code** | When 50 other communities ask for the same platform, you can't click through Console 50 times |
| 7 | **Monitoring built-in** | If something breaks at 2 AM before Fajr prayer, you need to know |

---

## Your Mission — 3 Labs

### Lab 1: Understand the Cloud Environment

> *Before you build anything, understand what you're working with.*

The instructor has already set up the GCP project with all the services you'll need. Your first job is to **explore the environment** and understand the architecture before touching anything.

**What you'll explore:**
- The VPC network securing the infrastructure
- Secret Manager holding the Firebase API keys
- Artifact Registry where container images are stored
- Cloud Build history showing how the instructor deployed
- Cloud Run hosting the live application
- Firestore storing community data

**Then read the code:**
- The **Dockerfile** that packages the app into a container
- The **pipeline YAML** that automates the entire build-scan-deploy process

> 💡 *A good cloud engineer reads before they run.*

📍 [**Start Lab 1 →**](lab1.md)

---

### Lab 2: Deploy the Application

> *The board approved it. Ship it — today.*

Now it's your turn. Using the CI/CD pipeline, you'll deploy your team's own instance of Madina Lab with **one command**. The pipeline handles everything:

1. **Lint** the Dockerfile for best practices (Hadolint)
2. **Build** the container image with secrets from Secret Manager
3. **Scan** for vulnerabilities before anything goes live (Trivy)
4. **Push** to Artifact Registry
5. **Deploy** to Cloud Run with team isolation
6. **Open** public access
7. **Map** your custom domain

**After deploying, you'll verify:**
- Security scan results — are there vulnerabilities?
- Cloud Run metrics — is your app healthy?
- Logs — what happened during startup?
- Your live app — can you sign up and use it?

> 💡 *Requirement #3 says scan before deploy. The pipeline enforces that automatically.*

📍 [**Start Lab 2 →**](lab2.md)

---

### Lab 3: Infrastructure as Code

> *"50 communities want this platform." You can't click through Console 50 times.*

Lab 2 deployed with `gcloud` commands — imperative, step by step. That works for one team. But what about 50 communities across the country?

In Lab 3, you'll deploy the **same application** using **Terraform** — a declarative approach where you describe *what* you want, and Terraform figures out *how* to create it.

**The Terraform pipeline adds:**
- **Checkov** scanning for infrastructure security (misconfigurations, compliance)
- **State tracking** — Terraform knows what exists and what changed
- **Per-team isolation** — each team's state is stored separately in a GCS bucket
- **Reproducibility** — run the same code for 1 team or 50 teams

**You'll compare:**

| | Lab 2 (gcloud) | Lab 3 (Terraform) |
|---|---|---|
| Approach | Imperative — *how* to do it | Declarative — *what* you want |
| Scale to 50 teams | 50 commands | Change one variable |
| State tracking | None | Terraform state file |
| Drift detection | Manual | Automatic |
| Code review | Hard to review CLI scripts | `.tf` files in pull requests |

> 💡 *Requirement #6: Infrastructure as Code. This is how real cloud teams operate at scale.*

📍 [**Start Lab 3 →**](lab3.md)

---

## How the Requirements Map to the Labs

| Requirement | Lab 1 | Lab 2 | Lab 3 |
|------------|-------|-------|-------|
| 1. Team isolation | See namespace in Firestore | `_TEAM` variable per deploy | Per-team Terraform state |
| 2. No hardcoded secrets | See Secret Manager | `secretEnv` + `--set-secrets` | Secrets created by setup script |
| 3. Security scanning | Read the pipeline steps | Hadolint + Trivy results | Checkov scan results |
| 4. One-command deploy | Read the deploy command | Run it yourself | Same — one command |
| 5. Scale to zero | See Cloud Run config | `--min-instances=0` | `min_instance_count = 0` |
| 6. Infrastructure as Code | — | — | Terraform `.tf` files |
| 7. Monitoring built-in | Explore Cloud Run metrics | Check logs + metrics | Same service, same monitoring |

---

## After the Workshop

You've just done what real cloud teams do every day:

- **Explored** a production cloud environment
- **Deployed** a containerized application with CI/CD
- **Scanned** for security vulnerabilities at every layer
- **Automated** infrastructure with Terraform
- **Monitored** a live application

The tools change. The cloud provider might change. But the pattern stays the same: **code → scan → deploy → monitor → repeat**.

---
