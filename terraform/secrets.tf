# Secret Manager resources for app secrets

locals {
  secrets = {
    "firebase-api-key"              = var.firebase_api_key
    "firebase-auth-domain"          = var.firebase_auth_domain
    "firebase-project-id"           = var.firebase_project_id
    "firebase-storage-bucket"       = var.firebase_storage_bucket
    "firebase-messaging-sender-id"  = var.firebase_messaging_sender_id
    "firebase-app-id"               = var.firebase_app_id
    "google-maps-api-key"           = var.google_maps_api_key
  }
}

resource "google_secret_manager_secret" "app_secrets" {
  for_each  = local.secrets
  secret_id = each.key

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "app_secret_versions" {
  for_each    = local.secrets
  secret      = google_secret_manager_secret.app_secrets[each.key].id
  secret_data = each.value
}
