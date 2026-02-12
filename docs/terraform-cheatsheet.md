# 🏗️ Terraform — Quick Reference

## Initial Setup

```bash
terraform init                              # Download providers & setup (run first!)
terraform init -upgrade                     # Upgrade provider versions
terraform init -reconfigure                 # Reconfigure backend
```
> Required before any Terraform operations. Creates `.terraform/` folder and downloads provider plugins.

## Core Commands (Daily Workflow)

```bash
terraform validate                          # Check syntax and configuration
terraform fmt                               # Auto-format all .tf files
terraform fmt -check                        # Check if formatting is valid
terraform fmt -recursive                    # Format all .tf files recursively
terraform plan                              # Preview what will be created/changed
terraform plan -out=plan.tfplan             # Save plan to file
terraform apply                             # Create/update resources (requires confirmation)
terraform apply plan.tfplan                 # Apply saved plan (no confirmation)
terraform apply -auto-approve               # Apply without confirmation (use in CI/CD)
terraform destroy                           # Delete all resources
terraform destroy -auto-approve             # Destroy without confirmation
terraform refresh                           # Sync state with actual infrastructure
```
> **Workflow:** validate → plan → apply. Always review plan before applying!

## Variables & Arguments

```bash
# Pass variables via command line
terraform plan -var="team=team1"            # Single variable
terraform plan -var="team=team1" -var="region=us-central1"  # Multiple
terraform apply -var="team=team1"

# Use variable file
terraform plan -var-file="production.tfvars"
terraform apply -var-file="production.tfvars"

# Environment variables (TF_VAR_* prefix)
export TF_VAR_team="team1"
terraform apply                             # Will use TF_VAR_team value

# Auto-load tfvars files
# terraform.tfvars and *.auto.tfvars are loaded automatically
```
> **Priority:** CLI → Environment → tfvars files → defaults. CLI values override everything.

## State Management

```bash
# View state
terraform state list                        # List all managed resources
terraform state list "module.app"           # Resources in specific module
terraform state show RESOURCE               # Show specific resource details
terraform state show "google_cloud_run_service.app"

# Modify state (use with caution!)
terraform state mv SOURCE DESTINATION       # Rename/move resource
terraform state rm RESOURCE                 # Remove from state (orphan resource)
terraform state push                        # Push state to remote

# Debug
terraform state pull                        # Download current remote state
terraform show                              # Display current state
terraform show -json                        # State as JSON
```
> **State:** Tracks real infrastructure. Don't edit directly. Use `state rm` to orphan resources instead of deleting terraform code.

## Workspaces (Multiple Environments)

```bash
terraform workspace list                    # List all workspaces
terraform workspace show                    # Show current workspace
terraform workspace new dev                 # Create new workspace
terraform workspace new production
terraform workspace select dev              # Switch workspace
terraform workspace delete dev              # Delete workspace
```
> Workspaces isolate state. Each workspace has separate state file. Use for dev/prod/staging.

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

## Backend Configuration (State Storage)

```hcl
# Local (not recommended for teams)
terraform {
  backend "local" {
    path = "terraform.tfstate"
  }
}

# GCS (Google Cloud Storage) - Recommended for GCP
terraform {
  backend "gcs" {
    bucket = "my-terraform-state"
    prefix = "terraform/state"
  }
}

# Configure backend via CLI
terraform init -backend-config="bucket=my-bucket" -backend-config="prefix=dev"
```
> Always store state remotely in teams. Local state = single source of truth lost.

## Debugging & Troubleshooting

```bash
# Enable detailed logging
TF_LOG=DEBUG terraform plan                 # Full debug output
TF_LOG=INFO terraform apply                 # Info level
TF_LOG_PATH=terraform.log terraform plan    # Save to file

# Validate configuration
terraform validate                          # Check for errors
terraform plan -json | jq                   # Parse plan as JSON

# Inspect resource
terraform console                           # Interactive REPL
# Then type: google_cloud_run_service.app.status

# Check what would happen (dry-run)
terraform plan -no-color > plan.txt         # Save readable plan
```

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Error: resource not found` | Resource doesn't exist | `terraform state rm` or add to state |
| `Error: index out of range` | Accessing non-existent index | Use `length()` to check or `?` operator |
| `Error: Unsupported argument` | Typo in argument name | Check provider docs for correct syntax |
| `Error: Conflict attribute` | Two attributes can't both be set | Use only one recommended approach |
| `state lock timeout` | Another process using state | Wait or manually unlock (careful!) |

## Best Practices

```bash
# 1. Structure
main.tf          # Main resources
variables.tf     # Input variables
outputs.tf       # Output values
providers.tf     # Provider configuration
terraform.tfvars # Variable values (commit example only, use .gitignore)

# 2. Before committing
terraform fmt    # Format consistently
terraform validate  # Check for errors
terraform plan   # Review changes

# 3. Version constraints
version = "~> 5.0"   # ~> means: 5.x but not 6.x (compatible)
version = ">= 5.0, < 6.0"  # Explicit range

# 4. Protect sensitive data
sensitive = true                            # Hide output values
variable "db_password" {
  sensitive = true
}

# 5. Use .gitignore for Terraform
.terraform/
*.tfstate
*.tfstate.*
crash.log
.env
```

## Quick Tips

```bash
# Count resources
terraform state list | wc -l

# Graph infrastructure (requires graphviz)
terraform graph | dot -Tsvg > graph.svg

# Import existing resource into state
terraform import google_cloud_run_service.app projects/PROJECT/locations/REGION/services/SERVICE

# Validate all modules
terraform validate -json | jq

# Find unused variables
grep -r "var\." *.tf | grep -oE 'var\.[a-z_]+' | sort -u
```