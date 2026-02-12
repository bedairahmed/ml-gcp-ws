# 🕌 Madina Lab — Lab 3: Infrastructure as Code

> *The board is excited. "50 other communities want this platform." You can't click through Console 50 times. Enter Terraform — infrastructure defined in code.*

---

## 🎯 Objectives

- Understand why Infrastructure as Code (IaC) matters
- Read Terraform configuration files and understand the structure
- See Checkov security scanning for Terraform
- Deploy infrastructure through a pipeline
- Compare imperative (gcloud) vs declarative (Terraform)

## ⏱ Duration: 30 minutes

## 👥 Roles

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Reads Terraform files, edits tfvars | Runs pipeline, checks plan output & Checkov results |

> **Switch from Lab 2!**

## 📖 Cheatsheets: [`docs/terraform-cheatsheet.md`](../docs/terraform-cheatsheet.md) · [`docs/yaml-cheatsheet.md`](../docs/yaml-cheatsheet.md)

---

## The Problem

Lab 2 used `gcloud` commands (imperative). That works for 1 team:

| Approach | 1 Team | 8 Teams | 50 Teams |
|----------|--------|---------|----------|
| Console (clicking) | 5 min | 40 min | 4+ hours |
| gcloud commands | 5 min | 20 min | 2+ hours |
| **Terraform** | **5 min** | **5 min** | **5 min** |

With Terraform:
- Infrastructure is **code** — stored in Git, peer-reviewed, versioned
- Changes are **planned** before applied — see what happens first
- State is **tracked** — knows what exists, what needs to change
- Security is **scanned** — Checkov catches misconfigurations before deploy

---

## Part A: Read the Terraform (10 min)

### Task 1: Open the Terraform Files

📍 **In your repo:**

```
ml-gcp-ws/terraform/
├── main.tf                  ← Provider config & backend
├── cloud_run.tf             ← Cloud Run service definition
├── iam.tf                   ← IAM bindings (public access, Cloud Build)
├── secrets.tf               ← Secret Manager resources
├── variables.tf             ← Input variables
├── outputs.tf               ← Output values (URL, service name)
└── terraform.tfvars.example ← Example values
```

Open each file and understand what it does:

| File | Purpose | Key resource |
|------|---------|-------------|
| [`terraform/main.tf`](../terraform/main.tf) | Provider & backend | `provider "google"` |
| [`terraform/cloud_run.tf`](../terraform/cloud_run.tf) | The app service | `google_cloud_run_v2_service` |
| [`terraform/iam.tf`](../terraform/iam.tf) | Who can access | `google_cloud_run_v2_service_iam_member` |
| [`terraform/secrets.tf`](../terraform/secrets.tf) | Firebase config | `google_secret_manager_secret` |
| [`terraform/variables.tf`](../terraform/variables.tf) | Inputs | `variable "student_namespace"` |
| [`terraform/outputs.tf`](../terraform/outputs.tf) | Results | `output "service_url"` |

> ❓ What resources does `cloud_run.tf` create? What port, memory, scaling?

---

### Task 2: Compare to the gcloud Command

In Lab 2, you deployed with this gcloud command (from [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml)):

```bash
gcloud run deploy madina-lab-team1 \
  --image=... --region=us-central1 --memory=256Mi --cpu=1 \
  --min-instances=0 --max-instances=3 --port=8080 \
  --service-account=team1-sa@...
```

Now look at [`terraform/cloud_run.tf`](../terraform/cloud_run.tf):

```hcl
resource "google_cloud_run_v2_service" "app" {
  name     = "madina-lab-${var.student_namespace}"
  location = var.region
  template {
    containers {
      image = var.image
      ports { container_port = 8080 }
      resources { limits = { cpu = var.cpu, memory = var.memory } }
    }
  }
}
```

> ❓ Same result — which is easier to read? To review in a pull request? To scale to 50?

---

### Task 3: Read the Terraform Pipeline

📍 **Open:** [`.pipelines/cloudbuild-tf.yaml`](../.pipelines/cloudbuild-tf.yaml)

This pipeline has **5 stages**:

| Stage | Name | What it does |
|-------|------|-------------|
| 1 | `build-app` | Build & push container image (app needs to exist first) |
| 2 | `checkov-scan` | Scan Terraform for security issues |
| 3 | `tf-init` | Download providers (`npm install` for infra) |
| 4 | `tf-plan` | Preview changes — nothing applied yet |
| 5 | `tf-apply` | Create/update resources |

> ❓ Why build the app image BEFORE running Terraform? (Hint: Terraform deploys the Cloud Run service that references this image)

> ❓ What does Checkov scan for? What does `--soft-fail` mean?

---

## Part B: Deploy with Terraform (15 min)

### Task 4: Run the Terraform Pipeline

Replace `teamN` with your team number:

```bash
gcloud builds submit --config .pipelines/cloudbuild-tf.yaml \
  --substitutions=_TEAM=teamN .
```

📍 **Role B:** Watch Console → Cloud Build → History.

---

### Task 5: Read the Results

Expand each step in Cloud Build:

**Step 2 — Checkov:**
> ❓ How many checks passed? How many failed? What did it flag?

**Step 4 — Terraform Plan:**
> ❓ What resources will be created? Look for `+` symbols. How many?

**Step 5 — Terraform Apply:**
> ❓ What outputs are displayed? (service URL, service name)

---

### Task 6: Visit Your Terraform-Deployed App

Find the service URL in the apply output, or:

📍 **Console → Cloud Run** → look for `madina-lab-teamN-tf` (note the `-tf` suffix)

> ❓ Same app, but deployed by Terraform instead of gcloud. Can you tell the difference?

---

## Part C: Compare & Reflect (5 min)

### Lab 2 Pipeline vs Lab 3 Pipeline

| | Lab 2 (App Pipeline) | Lab 3 (Terraform Pipeline) |
|---|---|---|
| **Pipeline** | [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml) | [`.pipelines/cloudbuild-tf.yaml`](../.pipelines/cloudbuild-tf.yaml) |
| **Approach** | Imperative (`gcloud run deploy`) | Declarative (`terraform apply`) |
| **Security scan** | Hadolint + Trivy (container) | Checkov (infrastructure) |
| **Infra defined in** | YAML flags | `.tf` files |
| **State tracking** | None | Terraform state |
| **Scaling to 50** | 50 commands | Change one variable |

---

## 💬 Discussion

1. When would you use `gcloud`? When Terraform?
2. What if someone changes something in Console after Terraform deployed it? (Drift)
3. Where would you store the Terraform state file in production?
4. Lab 2 scans the container (Trivy). Lab 3 scans the infra (Checkov). A real pipeline would do both — why?

---

## ✅ Checklist

- [ ] Read all Terraform files in [`terraform/`](../terraform/)
- [ ] Compared `cloud_run.tf` to gcloud command from Lab 2
- [ ] Read [`.pipelines/cloudbuild-tf.yaml`](../.pipelines/cloudbuild-tf.yaml) — understood all 5 steps
- [ ] Ran the Terraform pipeline
- [ ] Read Checkov scan results
- [ ] Read Terraform plan output
- [ ] Visited Terraform-deployed app

---

## 🎉 Workshop Complete!

You've gone from exploring GCP → deploying with CI/CD → managing infrastructure as code.

**What you touched today:**
- ☁️ GCP Console — VPC, Artifact Registry, Secret Manager, Cloud Build, Cloud Run, Firestore
- 🐳 Docker — multi-stage builds, container images
- 🔄 CI/CD — automated pipelines with security scanning
- 🔒 Security — Hadolint, Trivy (container) + Checkov (infrastructure)
- 📊 Monitoring — logs, metrics, health checks
- 🏗️ IaC — Terraform, plan before apply

📖 **All cheatsheets:** [`docs/`](../docs/)