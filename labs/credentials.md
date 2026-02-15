# 🕌 Madina Lab — Workshop Credentials

## Your Account

📋 [**Workshop Registration Sheet**](https://docs.google.com/spreadsheets/d/e/2PACX-1vSxQhQ5DcSui7mcSfXHVfUcVQpQWMklq4jzJzI1P9YLRgww02kMuk7HV3tdNUjxyJsYysvFosiCPy9J/pubhtml?gid=959209679&single=true)


## Login
1. Open **Chrome** → [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in: `studentN@ml-gcp.cloud-people.net` (password from sheet)
3. Change password on first login
4. Select project: **ml-gcp-workshop-487117**

## How to View Repo Files

Throughout the labs, you'll be asked to read files like the Dockerfile and pipeline YAML. You have two options:

| Option | How |
|--------|-----|
| **VS Code** (if installed) | Clone the repo locally: `git clone https://github.com/bedairahmed/ml-gcp-ws.git` |
| **GitHub** (no install needed) | Browse at [github.com/bedairahmed/ml-gcp-ws](https://github.com/bedairahmed/ml-gcp-ws) |

## Team Roles

Each team has **two members**. Switch roles between labs:

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Drives keyboard, runs commands | Follows in Console, checks logs & metrics |

## Cheatsheets

| Topic | Link |
|-------|------|
| GCP CLI (gcloud) | [`docs/gcloud-cheatsheet.md`](../docs/gcloud-cheatsheet.md) |
| Docker | [`docs/docker-cheatsheet.md`](../docs/docker-cheatsheet.md) |
| Terraform | [`docs/terraform-cheatsheet.md`](../docs/terraform-cheatsheet.md) |
| Cloud Build & CI/CD | [`docs/cloudbuild-cheatsheet.md`](../docs/cloudbuild-cheatsheet.md) |
| YAML | [`docs/yaml-cheatsheet.md`](../docs/yaml-cheatsheet.md) |
| Git | [`docs/git-cheatsheet.md`](../docs/git-cheatsheet.md) |

## Deploy Command

```bash
gcloud builds submit --config .pipelines/cloudbuild-app.yaml --substitutions=_TEAM=teamN .
```