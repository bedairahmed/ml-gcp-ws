# =============================================================================
#  🕌  Madina Lab — Cloud Run Service
# =============================================================================
#
#  Creates a Cloud Run v2 service for the team's app.
#
#  This is the Terraform equivalent of the gcloud command in the app pipeline:
#    gcloud run deploy madina-lab-teamN --image=... --memory=256Mi --port=8080
#
#  Key concepts:
#    - `locals` compute values from variables (like helper functions)
#    - `resource` creates real infrastructure in GCP
#    - `var.xxx` references input variables from variables.tf
#
# =============================================================================

# ── Computed Values ──────────────────────────────────────
# Defined in main.tf:
#   local.effective_service_name  → "madina-lab-team1"
#   local.effective_image         → Artifact Registry image URL

# ── Cloud Run Service ────────────────────────────────────
# This creates a serverless container service.
# Compare this to the gcloud command in .pipelines/cloudbuild-app.yaml Step 5.
resource "google_cloud_run_v2_service" "app" {
  name     = local.effective_service_name    # e.g., "madina-lab-team1"
  location = var.region                       # e.g., "us-central1"

  template {
    # ── Scaling ──
    # min=0: scales to zero when no traffic ($0 cost!)
    # max=3: limits concurrent instances (cost control)
    scaling {
      min_instance_count = var.min_instances   # default: 0
      max_instance_count = var.max_instances   # default: 3
    }

    containers {
      # Container image from Artifact Registry (built in pipeline Step 1)
      image = local.effective_image

      # Port 8080 — must match what nginx listens on in the Dockerfile
      ports {
        container_port = 8080
      }

      # Resource limits — keeps costs low for workshop
      resources {
        limits = {
          cpu    = var.cpu       # default: "1"
          memory = var.memory    # default: "256Mi"
        }
      }

      # Health check — Cloud Run pings /health to know if the container is ready
      # This endpoint is defined in the Dockerfile's nginx config
      startup_probe {
        http_get {
          path = "/health"
        }
        initial_delay_seconds = 5
        period_seconds        = 10
      }
    }
  }

  # Send 100% of traffic to the latest revision
  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}
