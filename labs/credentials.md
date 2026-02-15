# 🕌 Madina Lab — Workshop Credentials

## Your Account

📋 [**Workshop Registration Sheet**](https://docs.google.com/spreadsheets/d/e/2PACX-1vSxQhQ5DcSui7mcSfXHVfUcVQpQWMklq4jzJzI1P9YLRgww02kMuk7HV3tdNUjxyJsYysvFosiCPy9J/pubhtml?gid=959209679&single=true) — Find your team, email, and password here.

## Login

1. Open **Chrome Incognito** (Ctrl+Shift+N / Cmd+Shift+N)
2. Go to [console.cloud.google.com](https://console.cloud.google.com/?project=ml-gcp-workshop-487117)
3. Sign in: `studentN@ml-gcp.cloud-people.net` (password from sheet)
4. Change password on first login
5. Project should be **ml-gcp-workshop-487117** (if not, select it from the dropdown)

## Workshop Information

| Item | Details |
|------|---------|
| **GCP Project** | `ml-gcp-workshop-487117` |
| **Region** | `us-central1` |
| **GitHub Repo** | [github.com/bedairahmed/ml-gcp-ws](https://github.com/bedairahmed/ml-gcp-ws) |
| **AI Assistant** | [ML GCP Workshop Assistant](https://chatgpt.com/g/g-6991d00ab97c8191a1c1cbc4e1f23da1-ml-gcp-workshop-assistant) |
| **Instructor App** | [madina-lab-instructor](https://madina-lab-instructor-202948511064.us-central1.run.app) |

## Getting Started with Cloud Shell

All labs use **Cloud Shell** — a terminal in your browser. No local installs needed.

1. Click the **`>_`** icon (top right in Console) or [**Open Cloud Shell →**](https://console.cloud.google.com/cloudshell?project=ml-gcp-workshop-487117)
2. Clone the repo:
   ```bash
   git clone https://github.com/bedairahmed/ml-gcp-ws.git
   cd ml-gcp-ws
   ```
3. You're ready for the labs!

> 💡 Need help with Cloud Shell? See [`docs/cloudshell-cheatsheet.md`](../docs/cloudshell-cheatsheet.md)

## How to View Repo Files

Throughout the labs, you'll read files like the Dockerfile and pipeline YAML:

| Option | How |
|--------|-----|
| **Cloud Shell Editor** | Click the pencil icon in Cloud Shell to open the built-in editor |
| **GitHub** (no install needed) | Browse at [github.com/bedairahmed/ml-gcp-ws](https://github.com/bedairahmed/ml-gcp-ws) |

## Team Roles

Each team has **two members**. Switch roles between labs:

| | Role A — Builder | Role B — Observer |
|---|-----------------|-------------------|
| **Lab 1** | Navigates Console | Follows along, takes notes |
| **Lab 2** | Runs deploy in Cloud Shell | Watches Cloud Build steps |
| **Lab 3** | Reads Terraform files | Runs pipeline, reads plan output |

## Deploy Commands

```bash
# Lab 2 — App Pipeline
gcloud builds submit --config .pipelines/cloudbuild-app.yaml --substitutions=_TEAM=teamN .

# Lab 3 — Terraform Pipeline
gcloud builds submit --config .pipelines/cloudbuild-tf.yaml --substitutions=_TEAM=teamN .
```

> ⚠️ Replace `teamN` with your team number (e.g. `team1`, `team2`, etc.)

## Cheatsheets

| Topic | Link |
|-------|------|
| Cloud Shell | [`docs/cloudshell-cheatsheet.md`](../docs/cloudshell-cheatsheet.md) |
| GCP CLI (gcloud) | [`docs/gcloud-cheatsheet.md`](../docs/gcloud-cheatsheet.md) |
| Docker | [`docs/docker-cheatsheet.md`](../docs/docker-cheatsheet.md) |
| Terraform | [`docs/terraform-cheatsheet.md`](../docs/terraform-cheatsheet.md) |
| Cloud Build & CI/CD | [`docs/cloudbuild-cheatsheet.md`](../docs/cloudbuild-cheatsheet.md) |
| YAML | [`docs/yaml-cheatsheet.md`](../docs/yaml-cheatsheet.md) |
| Git | [`docs/git-cheatsheet.md`](../docs/git-cheatsheet.md) |

## Need Help?

- 🙋 Raise your hand — the instructor will come to you
- 🤖 [Ask the AI Assistant](https://chatgpt.com/g/g-6991d00ab97c8191a1c1cbc4e1f23da1-ml-gcp-workshop-assistant)
- 📧 Email: abedair@gmail.com

---

[→ Start Lab 1](lab1.md)