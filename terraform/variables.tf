# =============================================================================
#  🕌  Madina Lab — Input Variables
# =============================================================================
#
#  Values come from:
#    - terraform.tfvars (local use)
#    - -var="key=value" (pipeline — see .pipelines/cloudbuild-tf.yaml)
#    - defaults below
#
# =============================================================================

# ── Project ──────────────────────────────────────────────
variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

# ── Deployment ───────────────────────────────────────────
variable "student_namespace" {
  description = "Team namespace for isolation (team1, team2, ...)"
  type        = string
  default     = "default"
}

variable "service_name" {
  description = "Cloud Run service name (auto-derived if empty)"
  type        = string
  default     = ""
}

variable "image" {
  description = "Container image URL from Artifact Registry"
  type        = string
  default     = ""
}

# ── Resource Limits ──────────────────────────────────────
variable "min_instances" {
  description = "Min Cloud Run instances (0 = scale to zero)"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Max Cloud Run instances"
  type        = number
  default     = 3
}

variable "memory" {
  description = "Memory limit"
  type        = string
  default     = "256Mi"
}

variable "cpu" {
  description = "CPU limit"
  type        = string
  default     = "1"
}

# ── Secrets (for secrets.tf — instructor full setup only) ─
# These default to "" so the workshop pipeline works without them.
# secrets.tf will skip creation when values are empty.
variable "firebase_api_key" {
  type      = string
  sensitive = true
  default   = ""
}
variable "firebase_auth_domain" {
  type      = string
  sensitive = true
  default   = ""
}
variable "firebase_project_id" {
  type      = string
  sensitive = true
  default   = ""
}
variable "firebase_storage_bucket" {
  type      = string
  sensitive = true
  default   = ""
}
variable "firebase_messaging_sender_id" {
  type      = string
  sensitive = true
  default   = ""
}
variable "firebase_app_id" {
  type      = string
  sensitive = true
  default   = ""
}
variable "google_maps_api_key" {
  type      = string
  sensitive = true
  default   = ""
}
