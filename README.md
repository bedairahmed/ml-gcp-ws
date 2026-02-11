# 🕌 Madina Lab — GCP Deployment Guide

**Instructor:** Ahmed Bedair  
**Course:** GCP Cloud Engineering Workshop  
**Project:** Madina Lab — A trilingual community platform for the Muslim Community of Western Suburbs (MCWS), Canton, MI

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Prerequisites](#prerequisites)
4. [Local Development Setup](#local-development-setup)
5. [GCP Project Setup](#gcp-project-setup)
6. [Secret Manager Configuration](#secret-manager-configuration)
7. [Cloud Build — CI/CD Pipeline](#cloud-build--cicd-pipeline)
8. [Cloud Run — Deployment](#cloud-run--deployment)
9. [Terraform — Infrastructure as Code](#terraform--infrastructure-as-code)
10. [Firebase Setup](#firebase-setup)
11. [Troubleshooting](#troubleshooting)
12. [Tech Stack](#tech-stack)

---

## Project Overview

Madina Lab is a full-featured community platform built with React, TypeScript, and Firebase. It includes:

- 🕐 **Prayer Times** — Real-time prayer schedule via the Aladhan API
- 🌤️ **Weather Widget** — Live weather for Canton, MI via Open-Meteo
- 📿 **Athkar Tracker** — Morning & evening adhkar with tap counters and streak tracking
- 📅 **Community Events** — RSVP system, category filters, and announcements
- 💬 **Community Chat** — Group channels with @mentions, reactions, and reply threads
- 🏢 **Business Directory** — Muslim-owned business listings with reviews and claims
- 🌐 **Trilingual** — English, Arabic, and Urdu with full RTL support

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│   GitHub     │────▶│ Cloud Build  │────▶│   Cloud Run      │
│   (Source)   │     │ (CI/CD)      │     │   (Hosting)      │
└─────────────┘     └──────┬───────┘     └──────────────────┘
                           │
                    ┌──────▼───────┐     ┌──────────────────┐
                    │   Container  │     │  Secret Manager  │
                    │   Registry   │     │  (API Keys)      │
                    └──────────────┘     └──────────────────┘
                                         
                    ┌──────────────────────────────────────┐
                    │         Firebase / Firestore          │
                    │   (Auth, Database, Storage)           │
                    └──────────────────────────────────────┘
```

### GCP Services Used

| Service | Purpose |
|---------|---------|
| **Cloud Build** | CI/CD pipeline — builds Docker image and deploys on every push |
| **Cloud Run** | Serverless container hosting — runs the production app |
| **Container Registry** | Stores Docker images |
| **Secret Manager** | Securely stores API keys and Firebase config |
| **IAM** | Manages permissions for Cloud Build service account |
| **Terraform** | Infrastructure as Code — provisions all GCP resources |
| **Firebase** | Authentication (Google Sign-In), Firestore database |

---

## Prerequisites

Before starting, make sure you have:

- [ ] A **GCP account** with billing enabled
- [ ] [Google Cloud SDK (`gcloud`)](https://cloud.google.com/sdk/docs/install) installed
- [ ] [Node.js 20+](https://nodejs.org/) installed
- [ ] [Terraform](https://developer.hashicorp.com/terraform/downloads) installed (for IaC approach)
- [ ] [Docker](https://docs.docker.com/get-docker/) installed (for local testing)
- [ ] A **GitHub account** with this repository forked/cloned

---

## Local Development Setup

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>
cd madina-lab

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# Visit http://localhost:5173
```

### Local Docker Build (Optional)

```bash
# Build the Docker image locally
docker build -t madina-lab .

# Run the container
docker run -p 8080:8080 madina-lab

# Visit http://localhost:8080
```

---

## GCP Project Setup

### Step 1: Set Your Project

```bash
# Set your GCP project ID
export PROJECT_ID="your-gcp-project-id"
gcloud config set project $PROJECT_ID
```

### Step 2: Enable Required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com \
  secretmanager.googleapis.com \
  firebase.googleapis.com \
  firestore.googleapis.com
```

### Step 3: Grant Cloud Build Permissions

Cloud Build needs permission to deploy to Cloud Run and read secrets:

```bash
# Get the Cloud Build service account
export CB_SA=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')@cloudbuild.gserviceaccount.com

# Grant Cloud Run Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CB_SA" \
  --role="roles/run.admin"

# Grant Service Account User (needed to deploy to Cloud Run)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CB_SA" \
  --role="roles/iam.serviceAccountUser"

# Grant Secret Manager Accessor
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$CB_SA" \
  --role="roles/secretmanager.secretAccessor"
```

---

## Secret Manager Configuration

Madina Lab uses GCP Secret Manager to store sensitive configuration. **Never commit secrets to your code.**

### Create Secrets

```bash
# Firebase configuration secrets
echo -n "YOUR_FIREBASE_API_KEY" | \
  gcloud secrets create firebase-api-key --data-file=-

echo -n "your-project.firebaseapp.com" | \
  gcloud secrets create firebase-auth-domain --data-file=-

echo -n "your-project-id" | \
  gcloud secrets create firebase-project-id --data-file=-

echo -n "your-project.appspot.com" | \
  gcloud secrets create firebase-storage-bucket --data-file=-

echo -n "123456789" | \
  gcloud secrets create firebase-messaging-sender-id --data-file=-

echo -n "1:123456789:web:abcdef" | \
  gcloud secrets create firebase-app-id --data-file=-

# Google Maps API key (for Business Directory)
echo -n "YOUR_GOOGLE_MAPS_API_KEY" | \
  gcloud secrets create google-maps-api-key --data-file=-
```

### Verify Secrets

```bash
gcloud secrets list
```

> 💡 **Tip:** You can find your Firebase config values in the [Firebase Console](https://console.firebase.google.com/) → Project Settings → General → Your apps.

---

## Cloud Build — CI/CD Pipeline

The `cloudbuild.yaml` file defines the CI/CD pipeline that runs on every push to the repository.

### Pipeline Steps

1. **Fetch Secrets** — Reads API keys from Secret Manager
2. **Build Docker Image** — Multi-stage build (Node.js → nginx)
3. **Push to Container Registry** — Tags with commit SHA and `latest`
4. **Deploy to Cloud Run** — Updates the running service
5. **Cleanup** — Removes temporary build files

### Connect GitHub to Cloud Build

```bash
# Option A: Via Console
# Go to: https://console.cloud.google.com/cloud-build/triggers
# Click "Connect Repository" → Select GitHub → Authorize → Select repo

# Option B: Create a trigger via CLI
gcloud builds triggers create github \
  --repo-name="madina-lab" \
  --repo-owner="YOUR_GITHUB_USERNAME" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --description="Deploy Madina Lab on push to main"
```

### Manual Build (Without Trigger)

```bash
gcloud builds submit --config cloudbuild.yaml .
```

### View Build Logs

```bash
# List recent builds
gcloud builds list --limit=5

# View a specific build log
gcloud builds log BUILD_ID
```

---

## Cloud Run — Deployment

Cloud Run hosts the containerized application as a serverless service.

### Configuration

| Setting | Value | Why |
|---------|-------|-----|
| Region | `us-central1` | Low latency for Michigan users |
| Port | `8080` | nginx serves on port 8080 |
| Memory | `256Mi` | Sufficient for static file serving |
| CPU | `1` | Single CPU for the nginx container |
| Min instances | `0` | Scale to zero when idle (cost savings) |
| Max instances | `3` | Handles traffic spikes |

### Check Deployment Status

```bash
# List Cloud Run services
gcloud run services list

# Get the service URL
gcloud run services describe madina-lab --region=us-central1 --format='value(status.url)'

# View logs
gcloud run services logs read madina-lab --region=us-central1 --limit=50
```

---

## Terraform — Infrastructure as Code

The `terraform/` directory provisions all GCP resources declaratively.

### Files

| File | Description |
|------|-------------|
| `main.tf` | Provider config and project settings |
| `variables.tf` | Input variables (project ID, region, etc.) |
| `cloud_run.tf` | Cloud Run service definition |
| `secrets.tf` | Secret Manager resources |
| `iam.tf` | IAM role bindings |
| `outputs.tf` | Output values (service URL, etc.) |
| `terraform.tfvars.example` | Example variable values |

### Deploy with Terraform

```bash
cd terraform

# 1. Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your GCP project ID and secret values

# 2. Initialize Terraform
terraform init

# 3. Preview changes
terraform plan

# 4. Apply changes
terraform apply

# 5. View outputs (Cloud Run URL, etc.)
terraform output
```

### Destroy Resources (Cleanup)

```bash
terraform destroy
```

> ⚠️ **Warning:** This will delete all provisioned resources. Only use for cleanup after the workshop.

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** → Select your existing GCP project
3. Enable **Google Analytics** (optional)

### Step 2: Enable Authentication

1. Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add authorized domains:
   - `localhost`
   - Your Cloud Run URL (e.g., `madina-lab-xxxxx-uc.a.run.app`)

### Step 3: Create Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **production mode**
3. Select region: `us-central1`

### Step 4: Deploy Firestore Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| `Permission denied` on Cloud Build | Re-run the IAM commands in [Step 3](#step-3-grant-cloud-build-permissions) |
| Build fails with `secret not found` | Verify secrets exist: `gcloud secrets list` |
| App shows blank page after deploy | Check Cloud Run logs: `gcloud run services logs read madina-lab` |
| Firebase auth popup blocked | Add Cloud Run domain to Firebase authorized domains |
| Docker build fails locally | Ensure Node.js 20+ and run `npm install` first |
| Terraform `state lock` error | Run `terraform force-unlock LOCK_ID` |

### Useful Commands

```bash
# Check which project you're using
gcloud config get-value project

# Check enabled APIs
gcloud services list --enabled

# View Cloud Build service account
gcloud projects get-iam-policy $PROJECT_ID --format=json | grep cloudbuild

# Test the health endpoint
curl https://YOUR_CLOUD_RUN_URL/health
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **UI** | Tailwind CSS, shadcn/ui, Lucide Icons |
| **Backend** | Firebase (Auth, Firestore) |
| **Containerization** | Docker (multi-stage: Node.js + nginx) |
| **CI/CD** | Google Cloud Build |
| **Hosting** | Google Cloud Run |
| **Secrets** | GCP Secret Manager |
| **IaC** | Terraform |

---

## 📚 Resources

- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Secret Manager Documentation](https://cloud.google.com/secret-manager/docs)
- [Terraform GCP Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

---

**Built with ❤️ for the MCWS community**  
**Instructor:** Ahmed Bedair | GCP Cloud Engineering Workshop
