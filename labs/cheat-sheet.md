# Workshop Cheat Sheet

> Quick-reference for every key command across all labs. Replace `yourname` with your namespace.

---

## Lab 00 — Environment Setup

```bash
node -v                        # Verify Node.js ≥ 18
npm -v                         # Verify npm
git --version                  # Verify Git
docker --version               # Verify Docker
gcloud --version               # Verify Google Cloud CLI
terraform -v                   # Verify Terraform

git clone <REPO_URL>           # Clone the repository
cd madina-lab
npm install                    # Install dependencies
```

---

## Lab 01 — Explore the App

```bash
cp .env.example .env           # Create env file
npm run dev                    # Start dev server → http://localhost:8080
```

---

## Lab 02 — Firebase Setup

```bash
# Configure .env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_NAMESPACE=yourname

# Deploy Firestore rules
npm install -g firebase-tools
firebase login
firebase use your-project-id
firebase deploy --only firestore:rules
```

---

## Lab 03 — Docker Build

```bash
# Build the image
docker build \
  --build-arg VITE_FIREBASE_API_KEY=AIzaSy... \
  --build-arg VITE_FIREBASE_PROJECT_ID=your-project-id \
  --build-arg VITE_NAMESPACE=yourname \
  -t madina-lab-yourname .

# Run locally
docker run -p 8080:8080 madina-lab-yourname

# Verify
curl http://localhost:8080/health

# Useful Docker commands
docker images                  # List images
docker ps                      # List running containers
docker stop <ID>               # Stop a container
docker logs <ID>               # View container logs
```

---

## Lab 04 — GCP Setup

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  containerregistry.googleapis.com

# Create secrets
gcloud secrets create firebase-api-key --replication-policy="automatic"
echo -n "AIzaSy..." | gcloud secrets versions add firebase-api-key --data-file=-

# Grant Cloud Build access to secrets
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Grant Cloud Build → Cloud Run deploy
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud iam service-accounts add-iam-policy-binding \
  ${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

---

## Lab 05 — Deploy to Cloud Run

```bash
# Deploy via Cloud Build
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_STUDENT_NAMESPACE=yourname .

# Find your URL
gcloud run services list --region=us-central1
gcloud run services describe madina-lab-yourname \
  --region=us-central1 --format='value(status.url)'

# Health check
curl https://YOUR_CLOUD_RUN_URL/health

# View logs
gcloud run services logs read madina-lab-yourname \
  --region=us-central1 --limit=20
```

---

## Lab 06 — CI/CD Pipeline

```bash
# Create a Cloud Build trigger (console or CLI)
gcloud builds triggers create github \
  --repo-name=madina-lab \
  --repo-owner=YOUR_GITHUB_USER \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml \
  --substitutions=_STUDENT_NAMESPACE=yourname

# List triggers
gcloud builds triggers list

# View build history
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

---

## Lab 07 — Terraform

```bash
cd terraform

# Configure
cp terraform.tfvars.example terraform.tfvars
# Edit: student_namespace = "yourname"

# Init → Plan → Apply
terraform init
terraform plan
terraform apply                # Type: yes

# Inspect
terraform output
terraform state list
terraform state show google_cloud_run_v2_service.app

# Update (e.g. change max_instances in cloud_run.tf)
terraform plan                 # Shows diff
terraform apply                # Applies change

# Tear down (careful!)
terraform destroy
```

---

## Lab 08 — Namespace Isolation

```bash
# Verify namespace in app
echo $VITE_NAMESPACE           # Should print: yourname

# Check Firestore collections (Firebase Console)
# Look for: yourname_users, yourname_events, yourname_groups

# Verify different student data is isolated
gcloud run services list --region=us-central1
# Each student has their own service: madina-lab-alice, madina-lab-bob, etc.
```

---

## Helper Scripts

```bash
chmod +x scripts/*.sh

./scripts/setup.sh             # Verify prerequisites
./scripts/validate.sh yourname # Check lab completion
./scripts/cleanup.sh yourname  # Tear down all resources
```

---

## Quick Reference Table

| What | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build Docker image | `docker build -t madina-lab-yourname .` |
| Run container | `docker run -p 8080:8080 madina-lab-yourname` |
| Deploy to Cloud Run | `gcloud builds submit --config cloudbuild.yaml --substitutions=_STUDENT_NAMESPACE=yourname .` |
| Get service URL | `gcloud run services describe madina-lab-yourname --region=us-central1 --format='value(status.url)'` |
| Terraform deploy | `cd terraform && terraform apply -var="student_namespace=yourname"` |
| View Cloud Run logs | `gcloud run services logs read madina-lab-yourname --region=us-central1 --limit=20` |
| Validate progress | `./scripts/validate.sh yourname` |
| Clean up everything | `./scripts/cleanup.sh yourname` |
