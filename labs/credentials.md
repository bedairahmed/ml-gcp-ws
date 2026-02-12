# 🕌 Madina Lab — Workshop Credentials

## Your Account

📋 [**Workshop Registration Sheet**](https://docs.google.com/spreadsheets/d/e/2PACX-1vSxQhQ5DcSui7mcSfXHVfUcVQpQWMklq4jzJzI1P9YLRgww02kMuk7HV3tdNUjxyJsYysvFosiCPy9J/pubhtml?gid=959209679&single=true) — Find your team, email, and password here.

<iframe src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSxQhQ5DcSui7mcSfXHVfUcVQpQWMklq4jzJzI1P9YLRgww02kMuk7HV3tdNUjxyJsYysvFosiCPy9J/pubhtml?gid=959209679&amp;single=true&amp;widget=true&amp;headers=false" width="100%" height="400" frameborder="0"></iframe>

## Login

1. Open **Chrome** → [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in: `studentN@ml-gcp.cloud-people.net` (password from sheet above)
3. Change password on first login
4. Select project: **ml-gcp-workshop-487117**

## Team Roles

Each team has **two members**. Pick your roles and **switch between labs**:

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Drives keyboard, runs commands | Follows in Console, checks logs & metrics |

## Repo Structure

```
ml-gcp-ws/
├── Dockerfile                  ← Docker image (Lab 1, 2)
├── cloudbuild-app.yaml         ← CI/CD pipeline (Lab 1, 2)
├── docker-compose.yml          ← Local dev only
├── labs/
│   ├── CREDENTIALS.md          ← This file
│   ├── LAB1.md                 ← Lab 1: Explore & Meet the App
│   ├── LAB2.md                 ← Lab 2: Ship Your App
│   └── LAB3.md                 ← Lab 3: Infrastructure as Code
├── terraform/                  ← IaC files (Lab 3)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── terraform.tfvars
│   └── cloudbuild-tf.yaml
├── scripts/                    ← Instructor scripts
│   ├── setup.sh
│   ├── cleanup.sh
│   └── validate.sh
├── docs/                       ← Cheatsheets
│   ├── gcloud-cheatsheet.md
│   ├── docker-cheatsheet.md
│   ├── terraform-cheatsheet.md
│   ├── cloudbuild-cheatsheet.md
│   ├── yaml-cheatsheet.md
│   └── git-cheatsheet.md
├── src/                        ← React app source
└── public/                     ← Static assets
```

## Cheatsheets

| Cheatsheet | Link |
|-----------|------|
| GCP CLI (gcloud) | [`docs/gcloud-cheatsheet.md`](../docs/gcloud-cheatsheet.md) |
| Docker | [`docs/docker-cheatsheet.md`](../docs/docker-cheatsheet.md) |
| Terraform | [`docs/terraform-cheatsheet.md`](../docs/terraform-cheatsheet.md) |
| Cloud Build & CI/CD | [`docs/cloudbuild-cheatsheet.md`](../docs/cloudbuild-cheatsheet.md) |
| YAML | [`docs/yaml-cheatsheet.md`](../docs/yaml-cheatsheet.md) |
| Git | [`docs/git-cheatsheet.md`](../docs/git-cheatsheet.md) |

## Deploy Command

```bash
gcloud builds submit --config cloudbuild-app.yaml --substitutions=_TEAM=teamN .
```

Replace `teamN` with your team number (team1 – team8).