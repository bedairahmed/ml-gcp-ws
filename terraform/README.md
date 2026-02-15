# 🏗️ Madina Lab — Terraform Infrastructure

This directory contains Terraform configurations for deploying the Madina Lab application on Google Cloud Platform.

---

## How It Works

Terraform defines your cloud infrastructure as **code** — instead of clicking through the Console or running `gcloud` commands, you describe what you want in `.tf` files and Terraform creates it.

### Pipeline

The Terraform pipeline ([`.pipelines/cloudbuild-tf.yaml`](../.pipelines/cloudbuild-tf.yaml)) runs 5 steps:

| Step | Name | What it does |
|------|------|-------------|
| 1 | `build-app` | Build & push container image to Artifact Registry |
| 2 | `checkov-scan` | Scan `.tf` files for security issues ([Checkov](https://www.checkov.io/)) |
| 3 | `tf-init` | Download providers + configure per-team state backend |
| 4 | `tf-plan` | Preview what will change (`+` create, `~` update, `-` destroy) |
| 5 | `tf-apply` | Actually create/update the resources |

### Run it

```bash
gcloud builds submit --config .pipelines/cloudbuild-tf.yaml \
  --substitutions=_TEAM=teamN .
```

---

## File Structure

```
terraform/
├── provider.tf              ← Provider (Google Cloud) + GCS state backend
├── main.tf                  ← Data sources + locals (computed values)
├── cloud_run.tf             ← Cloud Run v2 service definition
├── iam.tf                   ← IAM bindings (public access)
├── secrets.tf               ← Secret Manager resources (reference only — see note)
├── variables.tf             ← Input variables (project, region, namespace, etc.)
├── outputs.tf               ← Output values (service URL, name, namespace)
└── terraform.tfvars.example ← Example variable values
```

### What Each File Does

| File | Purpose | Key resources |
|------|---------|--------------|
| [`provider.tf`](provider.tf) | Configures the Google Cloud provider and GCS backend for state storage | `provider "google"`, `backend "gcs"` |
| [`main.tf`](main.tf) | Data source (`google_project.project`) and computed values (`locals`) for service name and image URL | `data "google_project"`, `locals` |
| [`cloud_run.tf`](cloud_run.tf) | Cloud Run v2 service — image, port 8080, 256Mi memory, CPU throttling, scaling 0-3, health check at `/health`, team service account | `google_cloud_run_v2_service` |
| [`iam.tf`](iam.tf) | Makes the service publicly accessible (`allUsers` → `roles/run.invoker`) | `google_cloud_run_v2_service_iam_member` |
| [`secrets.tf`](secrets.tf) | Defines Secret Manager secrets for Firebase config — **see note below** | `google_secret_manager_secret` |
| [`variables.tf`](variables.tf) | All input variables with types, descriptions, and defaults | `variable "project_id"`, `variable "student_namespace"`, etc. |
| [`outputs.tf`](outputs.tf) | Values displayed after `terraform apply` | `output "service_url"`, `output "service_name"` |

> **📝 Note on `secrets.tf`:** This file shows how secrets *could* be managed in Terraform for a full standalone deployment. In this workshop, secrets are already created by [`scripts/setup.sh`](../scripts/setup.sh). The pipeline uses `-target` flags to only deploy Cloud Run + IAM, so `secrets.tf` is **never executed** during the workshop — it's there for reference only.

---

## Cloud Run Service Details

The `cloud_run.tf` creates a service with these settings (matching the app pipeline from Lab 2):

| Setting | Value | Why |
|---------|-------|-----|
| Name | `madina-lab-teamN` | One service per team |
| Image | `us-central1-docker.pkg.dev/.../madina-lab-teamN:latest` | Built in pipeline Step 1 |
| Port | `8080` | Matches nginx in Dockerfile |
| Memory | `256Mi` | Free tier friendly |
| CPU | `1` (throttled) | `cpu_idle = true` — CPU only allocated during requests |
| Scaling | 0 to 3 instances | Scales to zero = $0 when idle |
| Health check | `/health` (HTTP GET) | Startup probe verifies container is ready |
| Service account | `teamN-sa@project.iam.gserviceaccount.com` | Team-specific identity |
| Traffic | 100% to latest revision | Always serves newest deployment |

---

## State Backend

Terraform tracks what it has created in a **state file**. This state is stored in a GCS bucket so it persists between pipeline runs:

```
gs://ml-gcp-workshop-487117-tfstate/
  └── terraform/state/
      ├── team1/default.tfstate    ← Team 1's state
      ├── team2/default.tfstate    ← Team 2's state
      ├── ...
      └── team8/default.tfstate    ← Team 8's state
```

Each team gets isolated state — teams cannot affect each other's infrastructure. The per-team path is set by the pipeline:

```bash
terraform init -backend-config="prefix=terraform/state/${_TEAM}"
```

The bucket (`ml-gcp-workshop-487117-tfstate`) is created by the instructor during setup. Versioning is enabled for state recovery.

You can view state files in Console: [**Cloud Storage → tfstate bucket**](https://console.cloud.google.com/storage/browser/ml-gcp-workshop-487117-tfstate/terraform/state?project=ml-gcp-workshop-487117)

---

## What Gets Created

When a student runs the Terraform pipeline, it creates:

| Resource | Name | Description |
|----------|------|-------------|
| **Cloud Run service** | `madina-lab-teamN` | Serves the React app with CPU throttling, scaling 0-3, health check |
| **IAM binding** | `allUsers → run.invoker` | Makes the app publicly accessible |

> Secrets, VPC, Artifact Registry, and service accounts are created by [`scripts/setup.sh`](../scripts/setup.sh) — not by Terraform. The pipeline uses `-target` to only manage Cloud Run + IAM.

---

## Security Scanning

The pipeline runs [Checkov](https://www.checkov.io/) (Step 2) before Terraform init. Checkov scans all `.tf` files for:

- Public access without authentication
- Missing encryption settings
- Overly permissive IAM bindings
- Missing resource labels/tags
- CIS benchmark compliance

Results visible in **Cloud Build → History → click build → Step 2 logs**.

Currently `--soft-fail` (warnings only). Remove `--soft-fail` to block deployment on findings.

---

## Comparing Lab 2 vs Lab 3

| | Lab 2 (gcloud) | Lab 3 (Terraform) |
|---|---|---|
| **Command** | `gcloud run deploy ...` | `terraform apply` |
| **Approach** | Imperative — "do these steps" | Declarative — "make it look like this" |
| **State tracking** | None | `default.tfstate` in GCS |
| **Drift detection** | No | Yes — `terraform plan` shows changes |
| **Scale to 50 teams** | 50 commands | Change one variable |
| **Code review** | Review YAML steps | Review `.tf` files in PR |
| **Container scan** | Hadolint + Trivy | — |
| **Infra scan** | — | Checkov |

---

## Local Usage (Instructor Only)

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init -backend-config="prefix=terraform/state/instructor"
terraform plan
terraform apply
```

---

## Related Files

| File | Location | Purpose |
|------|----------|---------|
| Terraform pipeline | [`.pipelines/cloudbuild-tf.yaml`](../.pipelines/cloudbuild-tf.yaml) | CI/CD for Terraform |
| App pipeline | [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml) | CI/CD for app (imperative approach) |
| Dockerfile | [`Dockerfile`](../Dockerfile) | Container image built by pipeline Step 1 |
| Lab 3 guide | [`labs/lab3.md`](../labs/lab3.md) | Student instructions |
| Terraform cheatsheet | [`docs/terraform-cheatsheet.md`](../docs/terraform-cheatsheet.md) | Quick reference |
| Setup script | [`scripts/setup.sh`](../scripts/setup.sh) | Creates bucket, secrets, SAs, VPC |