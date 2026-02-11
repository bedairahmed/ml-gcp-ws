# Lab 07: Infrastructure as Code

⏱️ **Duration:** 25 minutes  
📋 **Objective:** Use Terraform to manage GCP infrastructure declaratively.

---

## 🎯 Learning Outcomes

- [ ] Understand Infrastructure as Code (IaC) concepts
- [ ] Read and understand Terraform configuration files
- [ ] Run `terraform plan` and `terraform apply`
- [ ] Manage Cloud Run, IAM, and secrets with Terraform

---

## Step 1: Understand IaC

| Approach | How It Works | Example |
|----------|-------------|---------|
| **Manual (Console)** | Click buttons in the UI | Lab 04 |
| **Imperative (CLI)** | Run commands step-by-step | `gcloud run deploy ...` |
| **Declarative (IaC)** | Describe desired state, tool makes it happen | Terraform |

```
Imperative (CLI):                    Declarative (Terraform):
"Create a VM"                        "I want a VM with these specs"
"Attach a disk"                      → Terraform figures out the steps
"Configure networking"               → Handles create/update/delete
"Set up firewall"                    → Tracks state automatically
```

> 💡 **Key insight:** With Terraform, you describe WHAT you want, not HOW to do it.

---

## Step 2: Review Terraform Files

```bash
cd terraform
ls -la
```

| File | Purpose |
|------|---------|
| `main.tf` | Provider config & project settings |
| `variables.tf` | Input variables (including `student_namespace`) |
| `cloud_run.tf` | Cloud Run service — auto-named per student |
| `iam.tf` | IAM roles & permissions |
| `secrets.tf` | Secret Manager resources |
| `outputs.tf` | Service URL, name, and namespace |

### Read the main files:

```bash
# Provider and project config
code main.tf

# Cloud Run service — the core of the deployment
code cloud_run.tf

# Secret Manager — same secrets we created manually in Lab 04
code secrets.tf
```

---

## Step 3: Configure Variables

```bash
cp terraform.tfvars.example terraform.tfvars
code terraform.tfvars
```

Fill in your values:

```hcl
project_id        = "your-gcp-project-id"
region            = "us-central1"
student_namespace = "yourname"    # ← Your unique namespace (e.g. alice, bob)

firebase_api_key             = "AIzaSy..."
firebase_auth_domain         = "your-project.firebaseapp.com"
firebase_project_id          = "your-project-id"
firebase_storage_bucket      = "your-project.firebasestorage.app"
firebase_messaging_sender_id = "123456789"
firebase_app_id              = "1:123456789:web:abcdef"
google_maps_api_key          = ""
```

> 💡 **`student_namespace`** automatically derives your service name (`madina-lab-yourname`) and image URL. No need to set those manually!

---

## Step 4: Initialize Terraform

```bash
terraform init
```

This downloads the Google Cloud provider plugin.

```
Initializing provider plugins...
- Installing hashicorp/google v5.x.x...
- Installed hashicorp/google v5.x.x

Terraform has been successfully initialized!
```

---

## Step 5: Plan (Preview Changes)

```bash
terraform plan
```

Terraform shows what it **would** do without making any changes:

```
Plan: 8 to add, 0 to change, 0 to destroy.
```

> 💡 **Always run `plan` before `apply`** — review what will change!

Read through the output. You should see:
- Secret Manager secrets being created
- IAM bindings being added
- Cloud Run service being defined

---

## Step 6: Apply (Create Resources)

```bash
terraform apply
```

Type `yes` when prompted.

Terraform creates all resources:
```
google_secret_manager_secret.app_secrets["firebase-api-key"]: Creating...
google_secret_manager_secret.app_secrets["firebase-api-key"]: Creation complete
...
Apply complete! Resources: 8 added, 0 changed, 0 destroyed.
```

---

## Step 7: View Outputs

```bash
terraform output
```

You'll see:
```
service_url        = "https://madina-lab-yourname-HASH.run.app"
service_name       = "madina-lab-yourname"
student_namespace  = "yourname"
```

---

## Step 8: Understand State

```bash
# List all managed resources
terraform state list

# Show details of a specific resource
terraform state show google_secret_manager_secret.app_secrets[\"firebase-api-key\"]
```

> 💡 **Terraform state** tracks what exists in the cloud. It compares desired state (your `.tf` files) with actual state to determine what to create, update, or delete.

---

## Step 9: Make a Change

Edit `cloud_run.tf` — change the max instances:

```hcl
# Find max_instance_count and change from 3 to 5
max_instance_count = 5
```

```bash
terraform plan
# Shows: 1 to change

terraform apply
# Type: yes
```

Terraform updates **only** the changed resource!

---

## Step 10: Clean Up (Optional)

> ⚠️ Only do this if you want to tear down all resources!

```bash
terraform destroy
# Type: yes
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Declarative** | Describe what you want, not how to build it |
| **State** | Terraform tracks what exists to calculate diffs |
| **Plan** | Preview changes before applying them |
| **Idempotent** | Running `apply` twice with no changes = no action |
| **Modules** | Reusable packages of Terraform config |

---

## ✅ Checkpoint

Before moving on, confirm:

- [ ] Terraform initialized successfully
- [ ] `terraform plan` shows expected resources
- [ ] `terraform apply` created resources
- [ ] You can read and understand `.tf` files
- [ ] You understand state and the plan→apply workflow

---

## 🔗 Next Lab

➡️ [Lab 08: Namespace Isolation](./08-namespace-isolation.md)
