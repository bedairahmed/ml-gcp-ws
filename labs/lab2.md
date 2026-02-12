# 🕌 Madina Lab — Lab 2: Ship Your App

> *The community board reviewed the demo. "We love it. Now each team ships their own version — live, today." Each team must be isolated: separate data, separate identity, separate URL. And every deploy must be scanned first.*

---

## 🎯 Objectives

- Understand the business requirements and trace them to the pipeline
- Deploy your team's app with one command
- Read security scan results in Cloud Build
- Verify your app is live and monitored

## ⏱ Duration: 35 minutes

## 👥 Roles

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Runs deploy command in Cloud Shell | Watches Cloud Build → each step |
| Reads terminal output | Checks Cloud Run: logs, metrics, secrets |

> **Switch from Lab 1!**

## 📖 Cheatsheets: [`docs/gcloud-cheatsheet.md`](../docs/gcloud-cheatsheet.md) · [`docs/cloudbuild-cheatsheet.md`](../docs/cloudbuild-cheatsheet.md)

---

## The Business Requirements

| # | Requirement | Why? | Where in pipeline? |
|---|------------|------|-------------------|
| 1 | Own URL per team | Work independently | `madina-lab-${_TEAM}` in [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml) → Step 5 |
| 2 | Isolated data | Team 1 ≠ Team 2 | `VITE_NAMESPACE=${_TEAM}` → Step 2 |
| 3 | Own service account | Least privilege | `${_TEAM}-sa@...` → Step 5 |
| 4 | Secrets from Secret Manager | Never hardcode keys | `secretEnv` + `--set-secrets` |
| 5 | Security scan before deploy | Catch vulns early | Hadolint (Step 1) + Trivy (Step 3) |
| 6 | Monitoring built-in | Logs & metrics day one | Cloud Run automatic |

---

## Part A: Understand the Pipeline (10 min)

### Task 1: Trace Your Team Name

📍 **Open:** [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml)

Find every `${_TEAM}`. This makes each deployment unique.

> ❓ How many times? What does it affect? (image name, service name, namespace, SA, labels)

---

### Task 2: Find the Secrets

In the same file, find:
- `secretEnv:` — injected at build time
- `--set-secrets=` — mounted at runtime
- `availableSecrets:` — definitions at bottom

> ❓ Difference between build-time secrets (Step 2) and runtime secrets (Step 5)?

---

### Task 3: Find the Security Scans

Step 1 (`lint-dockerfile`) and Step 3 (`scan-image`).

> ❓ What does Hadolint check? What does Trivy check? What severity levels?

---

## Part B: Deploy Your App (10 min)

### Task 4: Open Cloud Shell

📍 **Console → Cloud Shell icon** (top right, `>_`)

### Task 5: Clone the Repo

```bash
git clone https://github.com/bedairahmed/ml-gcp-ws.git
cd ml-gcp-ws
```

### Task 6: Deploy!

Replace `teamN` with **your team number**:

```bash
gcloud builds submit --config .pipelines/cloudbuild-app.yaml --substitutions=_TEAM=teamN .
```

> ⏳ ~4-5 min. **Role B:** watch Console → Cloud Build → History.

---

## Part C: Verify & Monitor (15 min)

### Task 7: Check Build Steps

📍 **Console → Cloud Build → History → click your build**

**Step 1 — Hadolint:**
> ❓ Any issues? What rules? (DL3018, DL3025)

**Step 3 — Trivy:**
> ❓ How many vulns? Any HIGH or CRITICAL?

---

### Task 8: Check Cloud Run

📍 **Console → Cloud Run → `madina-lab-teamN`**

| Tab | Look for |
|-----|---------|
| **Metrics** | Request count, latency |
| **Logs** | Startup logs, errors |
| **Revisions** | When created? |
| **Variables & Secrets** | Secret Manager refs |
| **Security** | `allUsers` listed? |

### Task 9: Visit Your App

> ❓ Does it load? Can you sign up? Separate from instructor's app?

### Task 10: Artifact Registry

📍 **Console → Artifact Registry → `madina-lab`**

> ❓ Find your team's image. What tag?

---

## 💬 Discussion

1. CRITICAL vulnerability found — should the build stop?
2. Why own service account per team?
3. How to roll back? (Cloud Run → Revisions)
4. What other steps for a production pipeline?

---

## ✅ Checklist

- [ ] Understood 6 business requirements
- [ ] Traced `_TEAM` through [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml)
- [ ] Deployed with one command
- [ ] Read Hadolint + Trivy results
- [ ] Checked Cloud Run: metrics, logs, secrets
- [ ] App is live
- [ ] Found image in Artifact Registry