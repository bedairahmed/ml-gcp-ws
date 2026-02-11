# Lab 04: GCP Setup

⏱️ **Duration:** 20 minutes  
📋 **Objective:** Enable GCP APIs, configure IAM permissions, and store secrets in Secret Manager.

---

## 🎯 Learning Outcomes

- [ ] Enable required GCP APIs
- [ ] Configure IAM roles for Cloud Build
- [ ] Store secrets securely in GCP Secret Manager
- [ ] Understand the principle of least privilege

---

## Step 1: Set Your Project

```bash
export PROJECT_ID="your-gcp-project-id"
gcloud config set project $PROJECT_ID

# Verify
gcloud config get-value project
```

---

## Step 2: Enable APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com
```

**What each API does:**

| API | Purpose |
|-----|---------|
| `cloudbuild` | Builds Docker images in the cloud |
| `run` | Hosts containers serverlessly |
| `containerregistry` | Stores Docker images |
| `secretmanager` | Securely stores API keys & credentials |

> 💡 Firebase APIs should already be enabled from Lab 02.

---

## Step 3: Configure IAM

Cloud Build needs permission to deploy to Cloud Run:

```bash
# Get the Cloud Build service account
export CB_SA=$(gcloud projects describe $PROJECT_ID \
  --format='value(projectNumber)')@cloudbuild.gserviceaccount.com

echo "Cloud Build SA: $CB_SA"
```

Grant the required roles:

```bash
# Permission to deploy Cloud Run services
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CB_SA" \
  --role="roles/run.admin"

# Permission to act as the Cloud Run service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CB_SA" \
  --role="roles/iam.serviceAccountUser"

# Permission to read secrets
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CB_SA" \
  --role="roles/secretmanager.secretAccessor"
```

**Understanding IAM roles:**

| Role | What It Allows |
|------|---------------|
| `roles/run.admin` | Create, update, delete Cloud Run services |
| `roles/iam.serviceAccountUser` | Impersonate service accounts (needed for deploy) |
| `roles/secretmanager.secretAccessor` | Read secret values (but not create/delete) |

> 💡 **Principle of least privilege:** Each role grants only what's needed — nothing more.

---

## Step 4: Create Secrets

Store your Firebase credentials in Secret Manager:

```bash
# Replace with YOUR actual values from .env
echo -n "AIzaSy..." | gcloud secrets create firebase-api-key --data-file=-
echo -n "your-project.firebaseapp.com" | gcloud secrets create firebase-auth-domain --data-file=-
echo -n "your-project-id" | gcloud secrets create firebase-project-id --data-file=-
echo -n "your-project.firebasestorage.app" | gcloud secrets create firebase-storage-bucket --data-file=-
echo -n "123456789" | gcloud secrets create firebase-messaging-sender-id --data-file=-
echo -n "1:123456789:web:abcdef" | gcloud secrets create firebase-app-id --data-file=-
```

> ⚠️ Use `echo -n` (no newline) to avoid trailing whitespace in secrets!

---

## Step 5: Verify Secrets

```bash
# List all secrets
gcloud secrets list

# Read a secret value (to verify)
gcloud secrets versions access latest --secret=firebase-project-id
```

You should see your project ID printed.

---

## Step 6: Understand the Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Secret Manager  │────▶│   Cloud Build    │────▶│  Docker Image │
│  (stores keys)   │     │  (reads secrets) │     │  (bakes in)   │
└──────────────────┘     └──────────────────┘     └──────────────┘
```

1. **Secret Manager** stores credentials securely (encrypted at rest)
2. **Cloud Build** reads them at build time using `gcloud secrets versions access`
3. **Docker** receives them as `--build-arg` values
4. **Vite** bakes them into the JavaScript bundle as `import.meta.env.VITE_*`

> 💡 Secrets never appear in your source code or Git history!

---

## ✅ Checkpoint

Before moving on, confirm:

- [ ] GCP project set and APIs enabled
- [ ] IAM roles granted to Cloud Build service account
- [ ] All Firebase secrets created in Secret Manager
- [ ] `gcloud secrets list` shows 6 secrets
- [ ] You understand the secrets → build → deploy flow

---

## 🔗 Next Lab

➡️ [Lab 05: Deploy to Cloud Run](./05-deploy-cloud-run.md)
