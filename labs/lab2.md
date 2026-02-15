# 🕌 Madina Lab — Lab 2: Ship Your App

> *"We love it. Now each team ships their own version — live, today."*

---

## 🎯 Objectives

- Trace business requirements to pipeline code
- Deploy your team's app with one command
- Read security scan results
- Verify your app is live and monitored

## ⏱ Duration: 35 minutes

## 👥 Roles — **Switch from Lab 1!**

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Runs deploy in Cloud Shell | Watches Cloud Build steps |

📖 Cheatsheets: [`docs/gcloud-cheatsheet.md`](../docs/gcloud-cheatsheet.md) · [`docs/cloudbuild-cheatsheet.md`](../docs/cloudbuild-cheatsheet.md)

---

## Business Requirements

| # | Requirement | Where in pipeline? |
|---|-----------|-------------------|
| 1 | Own URL per team | `madina-lab-${_TEAM}` → Step 5 |
| 2 | Isolated data | `VITE_NAMESPACE=${_TEAM}` → Step 2 |
| 3 | Own service account | `${_TEAM}-sa@...` → Step 5 |
| 4 | Secrets from Secret Manager | `secretEnv` + `--set-secrets` |
| 5 | Security scan before deploy | Hadolint (Step 1) + Trivy (Step 3) |
| 6 | Monitoring built-in | Cloud Run automatic |

---

## Part A: Understand the Pipeline (10 min)

### Task 1: Open the Pipeline

📍 [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml)
- VS Code: `ml-gcp-ws/.pipelines/cloudbuild-app.yaml`
- GitHub: [view on GitHub](https://github.com/bedairahmed/ml-gcp-ws/blob/main/.pipelines/cloudbuild-app.yaml)

Find every `${_TEAM}`.
> ❓ How many times? What does it affect?

### Task 2: Find the Secrets
- `secretEnv:` — build-time injection
- `--set-secrets=` — runtime mounting
- `availableSecrets:` — definitions at bottom

> ❓ Difference between build-time (Step 2) and runtime (Step 5) secrets?

### Task 3: Find the Security Scans
Step 1 (`lint-dockerfile`) and Step 3 (`scan-image`).
> ❓ What does each check? What severity levels?

---

## Part B: Deploy (10 min)

### Task 4: Open Cloud Shell

📍 [**Open Cloud Shell →**](https://console.cloud.google.com/cloudshell?project=ml-gcp-workshop-487117) (or click the `>_` icon top right in Console)

### Task 5: Clone & Deploy

```bash
git clone https://github.com/bedairahmed/ml-gcp-ws.git
cd ml-gcp-ws
gcloud builds submit --config .pipelines/cloudbuild-app.yaml --substitutions=_TEAM=teamN .
```

> ⏳ ~4-5 min. **Role B:** watch [Cloud Build History →](https://console.cloud.google.com/cloud-build/builds?project=ml-gcp-workshop-487117)

---

## Part C: Verify & Monitor (15 min)

### Task 6: Check Build Steps

📍 [**Open Cloud Build History →**](https://console.cloud.google.com/cloud-build/builds?project=ml-gcp-workshop-487117) → click your build

**Step 1 — Hadolint:** ❓ Any issues? What rules?
**Step 3 — Trivy:** ❓ How many vulns? Any HIGH/CRITICAL?

### Task 7: Check Cloud Run

📍 [**Open Cloud Run →**](https://console.cloud.google.com/run?project=ml-gcp-workshop-487117) → click `madina-lab-teamN`

| Tab | Look for |
|-----|---------| 
| Metrics | Request count, latency |
| Logs | Startup, errors |
| Revisions | When created |
| Variables & Secrets | Secret refs |
| Security | `allUsers`? |

### Task 8: Visit Your App
> ❓ Does it load? Can you sign up? Separate from instructor's app?

### Task 9: Artifact Registry

📍 [**Open Artifact Registry →**](https://console.cloud.google.com/artifacts/docker/ml-gcp-workshop-487117/us-central1/madina-lab?project=ml-gcp-workshop-487117)

> ❓ Find your image. What tag?

---

## 💬 Discussion

1. CRITICAL vulnerability — should the build stop?
2. Why own service account per team?
3. How to roll back? (Cloud Run → Revisions)
4. What other steps for production?

## ✅ Checklist

- [ ] Understood 6 business requirements
- [ ] Traced `_TEAM` through the pipeline
- [ ] Deployed with one command
- [ ] Read Hadolint + Trivy results
- [ ] Checked Cloud Run: metrics, logs, secrets
- [ ] App is live
- [ ] Found image in Artifact Registry

---
