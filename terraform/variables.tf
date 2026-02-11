variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "us-central1"
}

variable "student_namespace" {
  description = "Student namespace for isolated deployments (e.g. alice, bob)"
  type        = string
  default     = "default"
}

variable "service_name" {
  description = "Cloud Run service name (auto-derived from student_namespace if not set)"
  type        = string
  default     = ""
}

variable "image" {
  description = "Container image URL (gcr.io/PROJECT/IMAGE:TAG)"
  type        = string
}

variable "min_instances" {
  description = "Minimum Cloud Run instances"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum Cloud Run instances"
  type        = number
  default     = 3
}

variable "memory" {
  description = "Cloud Run memory allocation"
  type        = string
  default     = "256Mi"
}

variable "cpu" {
  description = "Cloud Run CPU allocation"
  type        = string
  default     = "1"
}

# Firebase / App secrets
variable "firebase_api_key" {
  description = "Firebase API key"
  type        = string
  sensitive   = true
}

variable "firebase_auth_domain" {
  description = "Firebase Auth domain"
  type        = string
  sensitive   = true
}

variable "firebase_project_id" {
  description = "Firebase project ID"
  type        = string
  sensitive   = true
}

variable "firebase_storage_bucket" {
  description = "Firebase storage bucket"
  type        = string
  sensitive   = true
}

variable "firebase_messaging_sender_id" {
  description = "Firebase messaging sender ID"
  type        = string
  sensitive   = true
}

variable "firebase_app_id" {
  description = "Firebase app ID"
  type        = string
  sensitive   = true
}

variable "google_maps_api_key" {
  description = "Google Maps API key"
  type        = string
  sensitive   = true
}
