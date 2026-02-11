locals {
  effective_service_name = var.service_name != "" ? var.service_name : "madina-lab-${var.student_namespace}"
  effective_image        = var.image != "" ? var.image : "gcr.io/${var.project_id}/madina-lab-${var.student_namespace}:latest"
}

resource "google_cloud_run_v2_service" "app" {
  name     = local.effective_service_name
  location = var.region

  template {
    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    containers {
      image = local.effective_image

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }

      startup_probe {
        http_get {
          path = "/health"
        }
        initial_delay_seconds = 5
        period_seconds        = 10
      }
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}
