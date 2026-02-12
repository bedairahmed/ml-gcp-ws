# =============================================================================
#  🕌  Madina Lab — Terraform Provider & Backend
# =============================================================================
#
#  Provider: Google Cloud — talks to GCP APIs
#  Backend:  GCS bucket  — stores Terraform state per team
#
#  State isolation:
#    team1 → gs://ml-gcp-workshop-487117-tfstate/terraform/state/team1/
#    team2 → gs://ml-gcp-workshop-487117-tfstate/terraform/state/team2/
#    ...
#
#  The prefix is set via -backend-config in the pipeline (cloudbuild-tf.yaml)
#  so each team has its own isolated state file.
#
# =============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "ml-gcp-workshop-487117-tfstate"
    # prefix is set dynamically via -backend-config="prefix=terraform/state/${_TEAM}"
    # in the pipeline. This ensures each team has isolated state.
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
