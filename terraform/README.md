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
├── providers.tf             ← Provider (Google Cloud) + GCS state backend
├── main.tf                  ← Data sources + locals
├── cloud_run.tf             ← Cloud Run v2 service definition
├── iam.tf                   ← IAM bindings (public access, Cloud Build SA)
├── secrets.tf               ← Secret Manager resources (Firebase config)
├── variables.tf             ← Input variables (project, region, namespace, etc.)
├── outputs.tf               ← Output values (service URL, name, namespace)
└── terraform.tfvars.example ← Example variable values
```

### What Each File Does

| File | Purpose | Key resources |
|------|---------|--------------|
| [`providers.tf`](providers.tf) | Configures the Google Cloud provider and GCS backend for state storage | `provider "google"`, `backend "gcs"` |
| [`main.tf`](main.tf) | Shared data sources and computed values | `data "google_project"`, `locals` |
| [`cloud_run.tf`](cloud_run.tf) | Defines the Cloud Run service — container image, port, memory, scaling, health check | `google_cloud_run_v2_service` |
| [`iam.tf`](iam.tf) | Makes the service publicly accessible + grants Cloud Build access to secrets | `google_cloud_run_v2_service_iam_member`, `google_project_iam_member` |
| [`secrets.tf`](secrets.tf) | Creates Secret Manager secrets for Firebase config | `google_secret_manager_secret`, `google_secret_manager_secret_version` |
| [`variables.tf`](variables.tf) | All input variables with types, descriptions, and defaults | `variable "project_id"`, `variable "student_namespace"`, etc. |
| [`outputs.tf`](outputs.tf) | Values displayed after `terraform apply` | `output "service_url"`, `output "service_name"` |

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

---

## What Gets Created

When a student runs the Terraform pipeline, it creates:

| Resource | Name | Description |
|----------|------|-------------|
| **Cloud Run service** | `madina-lab-teamN` | Serves the React app |
| **IAM binding** | `allUsers → run.invoker` | Makes the app publicly accessible |

> **Note:** Secrets, VPC, Artifact Registry, and service accounts are created by [`scripts/setup.sh`](../scripts/setup.sh) — not by Terraform. The pipeline uses `-target` to only manage Cloud Run + IAM.

---

## Security Scanning

The pipeline runs [Checkov](https://www.checkov.io/) (Step 2) before Terraform init. Checkov checks for:

- Public access without authentication
- Missing encryption settings
- Overly permissive IAM bindings
- Missing resource labels/tags
- CIS benchmark compliance

Results are visible in **Cloud Build → History → click build → Step 2 logs**.

Currently set to `--soft-fail` (warnings only). Remove `--soft-fail` to block deployment on security findings.

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
| App pipeline | [`.pipelines/cloudbuild-app.yaml`](../.pipelines/cloudbuild-app.yaml) | CI/CD for app (imperative) |
| Dockerfile | [`Dockerfile`](../Dockerfile) | Container image built by Step 1 |
| Lab 3 guide | [`labs/lab3.md`](../labs/lab3.md) | Student instructions for this lab |
| Terraform cheatsheet | [`docs/terraform-cheatsheet.md`](../docs/terraform-cheatsheet.md) | Quick reference |
| Setup script | [`scripts/setup.sh`](../scripts/setup.sh) | Creates bucket, secrets, SAs |