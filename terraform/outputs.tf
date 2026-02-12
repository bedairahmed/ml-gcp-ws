# =============================================================================
#  🕌  Madina Lab — Outputs
# =============================================================================
#  Displayed after `terraform apply`. Visible in Cloud Build → tf-apply logs.
# =============================================================================

output "service_url" {
  description = "Your app URL — open in browser"
  value       = google_cloud_run_v2_service.app.uri
}

output "service_name" {
  description = "Cloud Run service name"
  value       = google_cloud_run_v2_service.app.name
}

output "student_namespace" {
  description = "Team namespace"
  value       = var.student_namespace
}
