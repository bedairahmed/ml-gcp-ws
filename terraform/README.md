# Madina Lab — Terraform Infrastructure

This directory contains Terraform configurations for deploying Madina Lab on Google Cloud Platform.

## Structure

- `main.tf` — Provider config and core resources
- `variables.tf` — Input variables
- `outputs.tf` — Output values
- `cloud_run.tf` — Cloud Run service
- `secrets.tf` — Secret Manager resources
- `iam.tf` — IAM bindings
- `terraform.tfvars.example` — Example variable values

## Usage

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply
```
