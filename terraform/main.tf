# =============================================================================
#  🕌  Madina Lab — Main Configuration
# =============================================================================
#
#  Provider & backend → provider.tf
#  Cloud Run          → cloud_run.tf
#  IAM                → iam.tf
#  Secrets            → secrets.tf
#  Variables          → variables.tf
#  Outputs            → outputs.tf
#
# =============================================================================

# ── Data Sources ─────────────────────────────────────────
data "google_project" "project" {
  project_id = var.project_id
}

# ── Locals ───────────────────────────────────────────────
locals {
  effective_service_name = var.service_name != "" ? var.service_name : "madina-lab-${var.student_namespace}"
  effective_image        = var.image != "" ? var.image : "${var.region}-docker.pkg.dev/${var.project_id}/madina-lab/madina-lab-${var.student_namespace}:latest"
}
