# 🕌 Madina Lab — Lab 3: Infrastructure as Code

> *The board is excited. "50 other communities want this same platform. Can we deploy it for all of them?" You can't click through Console 50 times. There has to be a better way. Enter Terraform — infrastructure defined in code.*

---

## 🎯 Objectives

- Understand why Infrastructure as Code (IaC) matters
- Read and complete a Terraform configuration
- Deploy infrastructure through a pipeline
- Compare imperative (gcloud) vs declarative (Terraform)

## ⏱ Duration: 30 minutes

## 👥 Roles

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Edits `main.tf`, fills in the blanks | Runs the pipeline, checks plan output |

> **Switch from Lab 2!**

## 📖 Helpful Cheatsheet: [`docs/terraform-cheatsheet.md`](../docs/terraform-cheatsheet.md)

---

## The Problem

In Lab 2, you deployed with this command:

```bash
gcloud builds submit --config cloudbuild-app.yaml --substitutions=_TEAM=team1 .
```

That worked for **one team**. But what about 50?

| Approach | 1 Team | 8 Teams | 50 Teams |
|----------|--------|---------|----------|
| Console (clicking) | 5 min | 40 min | 4+ hours |
| gcloud commands | 5 min | 20 min | 2+ hours |
| **Terraform** | **5 min** | **5 min** | **5 min** |

With Terraform:
- Infrastructure is **code** — stored in Git, peer-reviewed, versioned
- Changes are **planned** before applied — see what will happen first
- State is **tracked** — knows what exists, what needs to change
- Everything is **repeatable** — run 50 times, same result

---

## Part A: Read the Terraform (10 min)

### Task 1: Open the Terraform Files

📍 **In your repo:**

```
ml-gcp-ws/terraform/
├── main.tf              ← Resource definitions (you edit this)
├── variables.tf         ← Input variables
├── outputs.tf           ← Output values (URL, service name, SA)
├── terraform.tfvars     ← Your team's values (you edit this)
└── cloudbuild-tf.yaml   ← Terraform pipeline
```

Open [`terraform/main.tf`](../terraform/main.tf) and read through it.

> ❓ What resources does it define? What data source does it use? (Hint: look for `resource` and `data`)

---

### Task 2: Find the TODOs

In [`terraform/main.tf`](../terraform/main.tf), look for lines marked with `# TODO`:

| TODO | What's missing | Hint |
|------|---------------|------|
| TODO 1 | Service account email | `${var.team}-sa@${var.project_id}.iam.gserviceaccount.com` |
| TODO 2 | Container image URL | `${var.region}-docker.pkg.dev/${var.project_id}/madina-lab/madina-lab-${var.team}:latest` |
| TODO 3 | Container port | Check [`Dockerfile`](../Dockerfile) — what port does nginx listen on? |

> ❓ How many TODOs are there?

---

### Task 3: Read the Terraform Pipeline

📍 **Open:** [`terraform/cloudbuild-tf.yaml`](../terraform/cloudbuild-tf.yaml)

This pipeline has 3 stages:

| Stage | Command | What it does |
|-------|---------|-------------|
| 1 | `terraform init` | Downloads providers (like `npm install` for infra) |
| 2 | `terraform plan` | Shows what WILL change — preview, no changes yet |
| 3 | `terraform apply` | Actually creates/updates the resources |

> ❓ Why is `plan` separate from `apply`?

---

## Part B: Fill & Deploy (15 min)

### Task 4: Edit terraform.tfvars

📍 **Open:** [`terraform/terraform.tfvars`](../terraform/terraform.tfvars)

Replace `teamN` with your team number:

```hcl
team       = "teamN"
project_id = "ml-gcp-workshop-487117"
region     = "us-central1"
```

---

### Task 5: Complete main.tf

📍 **Open:** [`terraform/main.tf`](../terraform/main.tf)

Fill in all 3 `# TODO` sections using the hints from Task 2.

---

### Task 6: Deploy with Terraform Pipeline

```bash
cd terraform
gcloud builds submit --config cloudbuild-tf.yaml \
  --substitutions=_TEAM=teamN .
```

📍 **Role B:** Watch in Console → Cloud Build → History.

You'll see 3 steps:
1. **init** — downloading providers
2. **plan** — preview of changes (read this!)
3. **apply** — creating resources

> ❓ In the plan output: what resources will be created? Look for `+` symbols.

---

## Part C: Compare & Reflect (5 min)

### Task 7: Side by Side

**Lab 2 — Imperative (gcloud):**
```bash
gcloud run deploy madina-lab-team1 \
  --image=us-central1-docker.pkg.dev/.../madina-lab-team1:latest \
  --region=us-central1 \
  --memory=256Mi --cpu=1 --cpu-throttling \
  --min-instances=0 --max-instances=3 \
  --port=8080 \
  --service-account=team1-sa@...iam.gserviceaccount.com \
  --labels=team=team1,env=workshop \
  --set-secrets=FIREBASE_API_KEY=firebase-api-key:latest,...
```

**Lab 3 — Declarative (Terraform):**
```hcl
resource "google_cloud_run_service" "app" {
  name     = "madina-lab-${var.team}"
  location = var.region

  template {
    spec {
      containers {
        image = ".../${var.team}:latest"
        ports { container_port = 8080 }
        resources {
          limits = { memory = "256Mi", cpu = "1" }
        }
      }
      service_account_name = "${var.team}-sa@..."
    }
  }
}
```

> ❓ Which is easier to read? Which is easier to review in a pull request?

---

## 💬 Discussion

1. When would you use `gcloud`? When Terraform?
2. What if someone changes something in Console after Terraform deployed it?
3. How would you handle different configs per community?
4. Where would you store the Terraform state file in production?

---

## ✅ Checklist

- [ ] Read [`terraform/main.tf`](../terraform/main.tf) — understood the resources
- [ ] Found and completed all 3 TODOs
- [ ] Read [`terraform/cloudbuild-tf.yaml`](../terraform/cloudbuild-tf.yaml) — understood init/plan/apply
- [ ] Deployed via Terraform pipeline
- [ ] Read the plan output
- [ ] Compared gcloud (Lab 2) vs Terraform (Lab 3)

---

## 🎉 Workshop Complete!

You've gone from exploring GCP → deploying with CI/CD → managing infrastructure as code.

**What you touched today:**
- ☁️ GCP Console — VPC, Artifact Registry, Secret Manager, Cloud Build, Cloud Run, Firestore
- 🐳 Docker — multi-stage builds, container images
- 🔄 CI/CD — automated pipelines with security scanning
- 🔒 Security — Hadolint, Trivy, Secret Manager
- 📊 Monitoring — logs, metrics, health checks
- 🏗️ IaC — Terraform, plan before apply

📖 **All cheatsheets:** [`docs/`](../docs/)