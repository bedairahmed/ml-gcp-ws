# 🕌 Madina Lab — Lab 2: Ship Your App

> *The community board reviewed the demo. "We love it. Now each team ships their own version — live, today." Each team must be isolated: separate data, separate identity, separate URL. And every deploy must be scanned for security issues first.*

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
| Runs the deploy command in Cloud Shell | Opens Cloud Build → watches each step |
| Reads terminal output | Checks Cloud Run: logs, metrics, secrets |

> **Switch from Lab 1!**

## 📖 Helpful Cheatsheets: [`docs/gcloud-cheatsheet.md`](../docs/gcloud-cheatsheet.md) · [`docs/cloudbuild-cheatsheet.md`](../docs/cloudbuild-cheatsheet.md)

---

## The Business Requirements

| # | Requirement | Why? | Where in the pipeline? |
|---|------------|------|----------------------|
| 1 | Each team gets its own URL | Work independently | `madina-lab-${_TEAM}` in [`cloudbuild-app.yaml`](../cloudbuild-app.yaml) → Step 5 |
| 2 | Data is isolated per team | Team 1 can't see Team 2 data | `VITE_NAMESPACE=${_TEAM}` in [`cloudbuild-app.yaml`](../cloudbuild-app.yaml) → Step 2 |
| 3 | Own service account per team | Least privilege | `${_TEAM}-sa@...` in [`cloudbuild-app.yaml`](../cloudbuild-app.yaml) → Step 5 |
| 4 | Secrets from Secret Manager | Never hardcode API keys | `secretEnv` + `--set-secrets` in [`cloudbuild-app.yaml`](../cloudbuild-app.yaml) |
| 5 | Security scan before deploy | Catch vulnerabilities early | Hadolint (Step 1) + Trivy (Step 3) in [`cloudbuild-app.yaml`](../cloudbuild-app.yaml) |
| 6 | Monitoring built-in | Logs, metrics from day one | Cloud Run automatic — Console → Metrics |

---

## Part A: Understand the Pipeline (10 min)

### Task 1: Trace Your Team Name

📍 **Open:** [`cloudbuild-app.yaml`](../cloudbuild-app.yaml)

Find every place `${_TEAM}` appears. This is what makes each team's deployment unique.

> ❓ How many times does `_TEAM` appear? What does it affect?

---

### Task 2: Find the Secrets

In the same file, find:
- `secretEnv:` — Cloud Build injects secrets into the build step
- `--set-secrets=` — Cloud Run mounts secrets at runtime
- `availableSecrets:` — secret definitions at the bottom

> ❓ What's the difference between build-time secrets (Step 2) and runtime secrets (Step 5)?

---

### Task 3: Find the Security Scans

Look at Step 1 (`lint-dockerfile`) and Step 3 (`scan-image`).

> ❓ What does Hadolint check? What does Trivy check? What severity levels?

---

## Part B: Deploy Your App (10 min)

### Task 4: Open Cloud Shell

📍 **Console → Click the Cloud Shell icon** (top right, `>_` button)

---

### Task 5: Clone the Repo

```bash
git clone https://github.com/bedairahmed/ml-gcp-ws.git
cd ml-gcp-ws
```

---

### Task 6: Deploy!

Replace `teamN` with **your team number** (team1 – team8):

```bash
gcloud builds submit --config cloudbuild-app.yaml --substitutions=_TEAM=teamN .
```

> ⏳ Takes ~4-5 min. **Role B:** watch in Console → Cloud Build → History.

---

## Part C: Verify & Monitor (15 min)

### Task 7: Check Build Steps

📍 **Console → Cloud Build → History → click your build**

Expand each step and read the logs:

**Step 1 — Hadolint (Dockerfile lint):**
> ❓ Any issues found? What rule numbers? (e.g., DL3018, DL3025)

**Step 3 — Trivy (vulnerability scan):**
> ❓ How many vulnerabilities? Any HIGH or CRITICAL?

---

### Task 8: Check Your Cloud Run Service

📍 **Console → Cloud Run → `madina-lab-teamN`**

| Tab | What to look for |
|-----|-----------------|
| **Metrics** | Request count, latency |
| **Logs** | Startup logs — any errors? |
| **Revisions** | When was it created? |
| **Variables & Secrets** | Secret Manager references |
| **Security** | Is `allUsers` listed? |

---

### Task 9: Visit Your App

Copy your Cloud Run URL and open it in a new tab.

> ❓ Does it load? Can you sign up? Is it separate from the instructor's app?

---

### Task 10: Check Artifact Registry

📍 **Console → Artifact Registry → `madina-lab`**

> ❓ Can you find your team's image? What's the tag?

---

## 💬 Discussion

1. What if Trivy found a CRITICAL vulnerability? Should the build stop?
2. Why does each team need its own service account?
3. How would you roll back? (Hint: Cloud Run → Revisions)
4. What other steps would a production pipeline have?

---

## ✅ Checklist

- [ ] Understood all 6 business requirements
- [ ] Traced `_TEAM` through [`cloudbuild-app.yaml`](../cloudbuild-app.yaml)
- [ ] Deployed with one command
- [ ] Read Hadolint results in Cloud Build logs
- [ ] Read Trivy scan results in Cloud Build logs
- [ ] Checked Cloud Run: metrics, logs, secrets
- [ ] Visited app URL — it's live
- [ ] Found image in Artifact Registry