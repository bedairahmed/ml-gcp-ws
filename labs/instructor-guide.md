# 🎓 Instructor Guide

> Timing, talking points, and common student issues for each lab. Total workshop duration: **~3 hours**.

---

## Before the Workshop

### Pre-requisites Checklist
- [ ] GCP project created with billing enabled
- [ ] Firebase project created with Auth + Firestore enabled
- [ ] All students have Google accounts with GCP access
- [ ] Verify `scripts/setup.sh` passes on the instructor machine
- [ ] Prepare a shared doc or Slack channel for questions
- [ ] Have the [Troubleshooting FAQ](./troubleshooting.md) open for reference

### Room Setup
- Ensure reliable Wi-Fi (Docker pulls + npm installs are bandwidth-heavy)
- Have a projector or screen share ready
- Consider pre-downloading Docker images on a shared registry to save time

---

## Lab 00 — Setup Environment

| | |
|---|---|
| **Duration** | 15 min |
| **Goal** | Everyone has tools installed and repo cloned |

### Talking Points
- Explain the workshop structure and what we'll build end-to-end
- Briefly introduce each tool: Node.js, Docker, gcloud CLI, Terraform
- Emphasize: "If you get stuck for more than 5 minutes, ask for help"

### Common Issues
| Issue | Solution |
|-------|----------|
| Node.js version too old | Use `nvm install 18` |
| Docker not running | Start Docker Desktop, wait for the whale icon |
| `gcloud` not authenticated | Run `gcloud auth login` |
| Slow `npm install` | Pre-cache `node_modules` on a shared drive or use `npm ci` |

### Timing Tips
- Start the timer only after everyone has cloned the repo
- Students with pre-installed tools will finish in 5 min — have them help others

---

## Lab 01 — Explore the App

| | |
|---|---|
| **Duration** | 20 min |
| **Goal** | Understand the app architecture and run it locally |

### Talking Points
- Walk through the project structure: `src/`, `labs/`, `terraform/`, `scripts/`
- Explain the component hierarchy: pages → layouts → components
- Show how React Router maps URLs to pages
- Point out the namespace system (`src/lib/namespace.ts`) — this is key for later labs

### Common Issues
| Issue | Solution |
|-------|----------|
| Blank page after `npm run dev` | Expected without Firebase config — show landing page |
| Port 8080 in use | `lsof -i :8080` then kill, or use `--port 3000` |
| TypeScript errors in IDE | Normal if extensions aren't installed — app still runs |

### Timing Tips
- Don't let students get lost reading every file — guide them to key files only
- Spend 5 min on a guided tour, then 15 min for self-exploration

---

## Lab 02 — Firebase Setup

| | |
|---|---|
| **Duration** | 25 min |
| **Goal** | Configure Firebase Auth + Firestore and see data flow |

### Talking Points
- Explain Firebase as a Backend-as-a-Service (BaaS)
- Walk through the Firebase Console: Project Settings → Web app config
- Explain each env variable and where it comes from
- Demo: sign in with Google, show the user document created in Firestore
- Explain Firestore rules and why they matter for security

### Common Issues
| Issue | Solution |
|-------|----------|
| `auth/invalid-api-key` | API key copied incorrectly — check for extra spaces |
| `auth/unauthorized-domain` | Add `localhost` to Firebase Auth → Authorized Domains |
| `Missing or insufficient permissions` | Deploy Firestore rules: `firebase deploy --only firestore:rules` |
| Google Sign-In popup blocked | Allow popups for localhost in browser settings |

### Timing Tips
- This lab has the most config — budget 5 extra minutes
- Have the Firebase Console projected so students can follow along
- Pre-create the Firebase web app config to save time

---

## Lab 03 — Docker Build

| | |
|---|---|
| **Duration** | 20 min |
| **Goal** | Build and run the app in a container |

### Talking Points
- Explain containers vs VMs — "shipping your app with its environment"
- Walk through the `Dockerfile` line by line: multi-stage build, nginx
- Explain `--build-arg` and why env vars must be injected at build time for Vite
- Demo: `docker build`, `docker run`, then `curl http://localhost:8080/health`
- Mention `docker-compose.yml` as a shortcut for local development

### Common Issues
| Issue | Solution |
|-------|----------|
| Build fails on `npm install` | Network issue — retry or use `--no-cache` |
| Container runs but page is blank | Missing `--build-arg` flags |
| `Cannot connect to Docker daemon` | Docker Desktop not running |
| Build takes too long | First build pulls base images — subsequent builds use cache |

### Timing Tips
- First Docker build can take 3–5 min — use this time to explain the Dockerfile
- Have students run the health check endpoint to confirm success

---

## Lab 04 — GCP Setup

| | |
|---|---|
| **Duration** | 20 min |
| **Goal** | Enable APIs, create secrets, configure IAM |

### Talking Points
- Explain the GCP resource hierarchy: Organization → Project → Resources
- Why we enable specific APIs (Run, Build, Secret Manager, Container Registry)
- Secret Manager: why we don't put API keys in code or environment variables
- IAM: principle of least privilege — explain each role we grant
- Service accounts: what they are and why Cloud Build needs them

### Common Issues
| Issue | Solution |
|-------|----------|
| `PERMISSION_DENIED` | Student isn't Owner/Editor — grant role in IAM |
| Wrong project selected | `gcloud config set project YOUR_PROJECT_ID` |
| Secret already exists | Use namespaced names: `yourname-firebase-api-key` |
| Billing not enabled | Must enable billing on the GCP project |

### Timing Tips
- This is a "follow along" lab — project the commands and go step by step
- IAM changes can take 1–2 min to propagate — warn students about this

---

## Lab 05 — Deploy to Cloud Run

| | |
|---|---|
| **Duration** | 15 min |
| **Goal** | Ship the app to production on Cloud Run |

### Talking Points
- Explain Cloud Run: fully managed, scales to zero, pay-per-request
- Walk through `cloudbuild.yaml`: build → push → deploy pipeline
- Explain substitution variables: `_STUDENT_NAMESPACE`
- Demo: submit the build, watch it in Cloud Build console
- Show the live URL — "You just deployed to production!" 🚀

### Common Issues
| Issue | Solution |
|-------|----------|
| Build fails | Check `gcloud builds log <BUILD_ID>` for details |
| `Container failed to start` | App not listening on port 8080 |
| Service not found | Wrong region — use `us-central1` |
| `403 Forbidden` on the URL | Service may need `--allow-unauthenticated` flag |

### Timing Tips
- Build + deploy takes ~3 min — use this time to explain Cloud Run pricing
- This is a celebratory moment — acknowledge that students just deployed to the cloud!

---

## Lab 06 — CI/CD Pipeline

| | |
|---|---|
| **Duration** | 20 min |
| **Goal** | Automate deployments with Cloud Build triggers |

### Talking Points
- Explain CI/CD: "Every push automatically builds and deploys"
- Walk through trigger configuration: repo, branch pattern, substitutions
- Explain the difference between manual `gcloud builds submit` and triggered builds
- Demo: make a small code change, push, watch the trigger fire
- Discuss: when would you use different branch patterns?

### Common Issues
| Issue | Solution |
|-------|----------|
| Trigger doesn't fire | Repo not connected or branch pattern wrong |
| GitHub repo not visible | Need to install Cloud Build GitHub app |
| Build succeeds but deploy fails | Missing IAM roles (see Lab 04) |
| Trigger fires on wrong branch | Check branch pattern regex: `^main$` |

### Timing Tips
- If GitHub isn't connected for all students, demo it on your machine
- The trigger setup via Console UI is easier than CLI — show both options

---

## Lab 07 — Terraform

| | |
|---|---|
| **Duration** | 25 min |
| **Goal** | Manage infrastructure as code with Terraform |

### Talking Points
- Explain IaC: "Your infrastructure described in files, versioned in Git"
- Walk through each `.tf` file: `main.tf`, `variables.tf`, `cloud_run.tf`, `iam.tf`, `secrets.tf`
- Explain the Terraform lifecycle: `init` → `plan` → `apply`
- Demo: show the plan output, explain what `+` and `~` mean
- Explain state: what `terraform.tfstate` is and why it matters
- Important: `terraform destroy` deletes real resources — use with caution

### Common Issues
| Issue | Solution |
|-------|----------|
| `terraform init` fails | Network issue or old Terraform version (need ≥ 1.5) |
| `Error 409: Resource already exists` | Import with `terraform import` |
| State file conflicts | Only one person should manage state per namespace |
| `terraform destroy` hangs | Target specific resources: `-target=...` |

### Timing Tips
- `terraform apply` takes 2–3 min — explain state management during the wait
- If time is short, have students run `plan` only and review the output together
- This is the most conceptually dense lab — go slower here

---

## Lab 08 — Namespace Isolation

| | |
|---|---|
| **Duration** | 10 min |
| **Goal** | Verify data isolation between students |

### Talking Points
- Explain multi-tenancy: shared infrastructure, isolated data
- Show how `VITE_NAMESPACE` prefixes Firestore collections
- Demo: compare two students' Firestore data in the Firebase Console
- Discuss real-world uses: staging vs production, per-client environments
- Wrap up: review what we built end-to-end

### Common Issues
| Issue | Solution |
|-------|----------|
| Seeing another student's data | `VITE_NAMESPACE` not set or matches another student |
| Collections look empty | Look for prefixed names: `yourname_users` |
| Namespace not applying after change | Need to rebuild and redeploy |

### Timing Tips
- This is a short wrap-up lab — use remaining time for Q&A
- Ask students to visit each other's deployed URLs to see isolation in action

---

## Workshop Wrap-Up (10 min)

### Recap Talking Points
1. **What we built**: A full-stack app deployed to the cloud with CI/CD and IaC
2. **Key concepts**: Containers, Cloud Run, Secret Manager, IAM, Terraform, CI/CD
3. **Skills gained**: Docker, GCP, Terraform, Firebase — all production-grade tools
4. **Next steps**: Customize the app, add features, explore GCP further

### Suggested Closing Activities
- Have students run `./scripts/validate.sh yourname` to see their progress
- Screenshot their deployed app for their portfolio
- Share the [Cheat Sheet](./cheat-sheet.md) for future reference
- Run `./scripts/cleanup.sh yourname` if resources should be torn down

### Feedback
- Collect feedback on pacing, difficulty, and content
- Ask: "What was the most surprising thing you learned?"
- Share resources for continued learning

---

## Quick Timing Reference

| Lab | Duration | Cumulative |
|-----|----------|------------|
| 00 — Setup | 15 min | 0:15 |
| 01 — Explore | 20 min | 0:35 |
| *Break* | *5 min* | *0:40* |
| 02 — Firebase | 25 min | 1:05 |
| 03 — Docker | 20 min | 1:25 |
| *Break* | *10 min* | *1:35* |
| 04 — GCP Setup | 20 min | 1:55 |
| 05 — Deploy | 15 min | 2:10 |
| *Break* | *5 min* | *2:15* |
| 06 — CI/CD | 20 min | 2:35 |
| 07 — Terraform | 25 min | 3:00 |
| 08 — Namespace | 10 min | 3:10 |
| Wrap-Up | 10 min | **3:20** |
