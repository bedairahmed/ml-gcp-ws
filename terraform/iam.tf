# =============================================================================
#  🕌  Madina Lab — IAM Bindings
# =============================================================================
#
#  IAM = Identity and Access Management (who can do what)
#
#  This file creates two bindings:
#    1. Public access — anyone can visit the Cloud Run URL
#    2. Cloud Build access — pipeline can read secrets from Secret Manager
#
# =============================================================================

# ── Public Access ────────────────────────────────────────
# Grants "allUsers" the Cloud Run Invoker role.
# This is the Terraform equivalent of:
#   gcloud run services add-iam-policy-binding ... --member=allUsers --role=roles/run.invoker
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ── Cloud Build → Secret Manager ────────────────────────
# Allows the Cloud Build service account to read secrets.
# Without this, the build pipeline can't inject Firebase config.
resource "google_project_iam_member" "cloudbuild_secret_access" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${data.google_project.project.number}@cloudbuild.gserviceaccount.com"
}

# Look up the project number (needed for Cloud Build SA email)
data "google_project" "project" {
  project_id = var.project_id
}
