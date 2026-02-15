# 🕌 Madina Lab — Lab 3: Infrastructure as Code

> *"50 communities want this platform." You can't click through Console 50 times.*

---

## 🎯 Objectives

- Understand why IaC matters
- Read Terraform files and understand the structure
- See Checkov security scanning
- Deploy via Terraform pipeline
- Compare imperative (gcloud) vs declarative (Terraform)

## ⏱ Duration: 30 minutes

## 👥 Roles — **Switch from Lab 2!**

| Role A — Builder | Role B — Observer |
|-----------------|-------------------|
| Reads Terraform files | Runs pipeline, reads plan + Checkov output |

📖 Cheatsheets: [`docs/terraform-cheatsheet.md`](../docs/terraform-cheatsheet.md) · [`docs/yaml-cheatsheet.md`](../docs/yaml-cheatsheet.md)

---

## The Problem

| Approach | 1 Team | 8 Teams | 50 Teams |
|----------|--------|---------|----------|
| Console | 5 min | 40 min | 4+ hours |
| gcloud | 5 min | 20 min | 2+ hours |
| **Terraform** | **5 min** | **5 min** | **5 min** |

---

## Part A: Read the Terraform (10 min)

### Task 1: Open the Terraform Files

📍 Browse `terraform/` in your repo:
- VS Code: `ml-gcp-ws/terraform/`
- GitHub: [view on GitHub](https://github.com/bedairahmed/ml-gcp-ws/tree/main/terraform)

```
terraform/
├── provider.tf              ← Provider + GCS state backend
├── main.tf                  ← Data sources + locals
├── cloud_run.tf             ← Cloud Run service ⭐
├── iam.tf                   ← Public access + Cloud Build permissions
├── secrets.tf               ← Secret Manager (instructor setup)
├── variables.tf             ← Input variables
├── outputs.tf               ← Results (URL, service name)
└── terraform.tfvars.example ← Example values
```

Read each file:

| File | What to look for |
|------|-----------------|
| [`provider.tf`](../terraform/provider.tf) | `backend "gcs"` — where is state stored? |
| [`main.tf`](../terraform/main.tf) | `data "google_project"` + `locals` — computed values |
| [`cloud_run.tf`](../terraform/cloud_run.tf) | `google_cloud_run_v2_service` — port, memory, scaling, health check |
| [`iam.tf`](../terraform/iam.tf) | `allUsers` — same as Step 6 in app pipeline |
| [`variables.tf`](../terraform/variables.tf) | What inputs does Terraform need? |
| [`outputs.tf`](../terraform/outputs.tf) | What's displayed after apply? |

> ❓ In `cloud_run.tf`: what port? what memory? min/max instances? what path does the health check use?

### Task 2: Compare to gcloud

Lab 2 deployed with gcloud (from [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml)):

```bash
gcloud run deploy madina-lab-team1 \
  --image=... --memory=256Mi --cpu=1 \
  --min-instances=0 --max-instances=3 --port=8080
```

Now look at [`terraform/cloud_run.tf`](../terraform/cloud_run.tf):

```hcl
resource "google_cloud_run_v2_service" "app" {
  name     = "madina-lab-${var.student_namespace}"
  location = var.region
  template {
    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
    containers {
      image = local.effective_image
      ports { container_port = 8080 }
      resources { limits = { cpu = var.cpu, memory = var.memory } }
      startup_probe { http_get { path = "/health" } }
    }
  }
}
```

> ❓ Same result — which is easier to read? To review in a pull request?

### Task 3: Read the Terraform Pipeline

📍 [`.pipelines/cloudbuild-tf.yaml`](../.pipelines/cloudbuild-tf.yaml)
- VS Code: `ml-gcp-ws/.pipelines/cloudbuild-tf.yaml`
- GitHub: [view on GitHub](https://github.com/bedairahmed/ml-gcp-ws/blob/main/.pipelines/cloudbuild-tf.yaml)

| Step | Name | What |
|------|------|------|
| 1 | `build-app` | Build & push image (must exist before TF) |
| 2 | `checkov-scan` | Scan Terraform for security issues |
| 3 | `tf-init` | Download providers + configure per-team state backend |
| 4 | `tf-plan` | Preview changes (`+` create, `~` update, `-` destroy) |
| 5 | `tf-apply` | Create resources |

> ❓ Why build the image BEFORE Terraform? Why does Checkov use `--soft-fail`?

> ❓ `tf-init` sets `-backend-config="prefix=terraform/state/${_TEAM}"` — each team's state is stored separately in a GCS bucket. Why?

---

## Part B: Deploy with Terraform (15 min)

### Task 4: Run the Pipeline

```bash
gcloud builds submit --config .pipelines/cloudbuild-tf.yaml \
  --substitutions=_TEAM=teamN .
```

📍 **Role B:** Watch [**Cloud Build History →**](https://console.cloud.google.com/cloud-build/builds?project=ml-gcp-workshop-487117)

### Task 5: Read the Results

**Step 2 — Checkov:** ❓ How many checks passed/failed? What was flagged?

**Step 4 — Plan:** ❓ What resources created? Look for `+` symbols.

**Step 5 — Apply:** ❓ What outputs? (service URL, name)

### Task 6: Visit Your App

📍 [**Open Cloud Run →**](https://console.cloud.google.com/run?project=ml-gcp-workshop-487117) → look for your service

> ❓ Same app, deployed by Terraform. Can you tell the difference?

---

## Part C: Compare (5 min)

| | Lab 2 (App Pipeline) | Lab 3 (Terraform Pipeline) |
|---|---|---|
| **Pipeline** | `cloudbuild-app.yaml` | `cloudbuild-tf.yaml` |
| **Approach** | Imperative (`gcloud`) | Declarative (`terraform`) |
| **Container scan** | Hadolint + Trivy | — |
| **Infra scan** | — | Checkov |
| **State tracking** | None | Terraform state |
| **Scale to 50** | 50 commands | Change one variable |

---

## 💬 Discussion

1. When `gcloud`? When Terraform?
2. Someone changes Console after Terraform deployed — what happens? (Drift)
3. Where store Terraform state in production?
4. Lab 2 scans containers (Trivy). Lab 3 scans infra (Checkov). A real pipeline does both — why?

## ✅ Checklist

- [ ] Read all Terraform files in [`terraform/`](../terraform/)
- [ ] Compared `cloud_run.tf` to gcloud from Lab 2
- [ ] Read pipeline [`.pipelines/cloudbuild-tf.yaml`](../.pipelines/cloudbuild-tf.yaml) — all 5 steps
- [ ] Ran the Terraform pipeline
- [ ] Read Checkov results
- [ ] Read Terraform plan output
- [ ] Visited Terraform-deployed app

---

## 🎉 Workshop Complete!

**Today you touched:**
- ☁️ GCP Console — VPC, Artifact Registry, Secret Manager, Cloud Build, Cloud Run, Firestore
- 🐳 Docker — multi-stage builds
- 🔄 CI/CD — automated pipelines
- 🔒 Security — Hadolint + Trivy (container) + Checkov (infrastructure)
- 📊 Monitoring — logs, metrics, health checks
- 🏗️ IaC — Terraform, plan before apply

📖 **All cheatsheets:** [`docs/`](../docs/)

---
[Take the Lab 3 Quiz →](quizzes/quiz3.md)

### 📋 [Submit Workshop Feedback →](https://github.com/bedairahmed/ml-gcp-ws/issues/new?template=workshop-feedback.yml)