# 🏗️ Terraform — Quick Reference

## Core Commands

```bash
terraform init           # Download providers (run first)
terraform plan           # Preview changes (dry run)
terraform apply          # Create/update resources
terraform destroy        # Delete all resources
terraform fmt            # Format .tf files
terraform validate       # Check syntax
```

## With Variables

```bash
terraform plan -var="team=team1"              # Pass variable
terraform apply -var="team=team1"             # Apply with variable
terraform apply -var-file="custom.tfvars"     # Use variable file
terraform apply -auto-approve                 # Skip confirmation
```

## State

```bash
terraform state list                          # List managed resources
terraform state show RESOURCE                 # Show resource details
terraform refresh                             # Sync state with real infra
```

## HCL Syntax

### Resource

```hcl
resource "google_cloud_run_service" "app" {
  name     = "my-service"
  location = "us-central1"
}
```

### Variable

```hcl
variable "team" {
  description = "Team name"
  type        = string
  default     = "team1"
}
```

### Output

```hcl
output "url" {
  value = google_cloud_run_service.app.status[0].url
}
```

### Reference

```hcl
# Reference a variable
name = "madina-lab-${var.team}"

# Reference another resource
service = google_cloud_run_service.app.name
```

## Plan Output Symbols

| Symbol | Meaning |
|--------|---------|
| `+` | Create (new resource) |
| `~` | Update (change existing) |
| `-` | Destroy (delete resource) |
| `-/+` | Replace (destroy then create) |