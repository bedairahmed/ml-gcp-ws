# 🔧 Troubleshooting FAQ

> Common errors students encounter during the workshop and how to fix them.

---

## Lab 00 — Environment Setup

### `node: command not found`
**Cause:** Node.js is not installed or not in your PATH.  
**Fix:**
```bash
# macOS (Homebrew)
brew install node

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 18
```

### `docker: command not found`
**Cause:** Docker Desktop is not installed or not running.  
**Fix:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and make sure it's running (check for the whale icon in your system tray).

### `gcloud: command not found`
**Cause:** Google Cloud CLI is not installed.  
**Fix:** Follow the [official install guide](https://cloud.google.com/sdk/docs/install).

---

## Lab 01 — Explore the App

### `npm run dev` shows blank page
**Cause:** Missing `.env` file or Firebase credentials not set.  
**Fix:**
```bash
cp .env.example .env
# Edit .env with your Firebase credentials (Lab 02)
```
> Without Firebase credentials, the app will show the landing page — this is expected until Lab 02.

### Port 8080 already in use
**Cause:** Another process is using port 8080.  
**Fix:**
```bash
# Find and kill the process
lsof -i :8080
kill -9 <PID>

# Or run on a different port
npm run dev -- --port 3000
```

---

## Lab 02 — Firebase Setup

### `Firebase: Error (auth/invalid-api-key)`
**Cause:** The `VITE_FIREBASE_API_KEY` in your `.env` is missing or incorrect.  
**Fix:** Double-check the API key from your Firebase Console → Project Settings → General → Web API Key.

### `Firebase: Error (auth/unauthorized-domain)`
**Cause:** Your preview domain isn't authorized in Firebase.  
**Fix:** Go to Firebase Console → Authentication → Settings → Authorized Domains → Add your domain (e.g., `localhost`, `*.lovableproject.com`).

### `FirebaseError: Missing or insufficient permissions`
**Cause:** Firestore rules haven't been deployed or are too restrictive.  
**Fix:**
```bash
firebase deploy --only firestore:rules
```
Make sure your `firestore.rules` allows authenticated reads/writes.

---

## Lab 03 — Docker Build

### `docker build` fails with `npm ERR! could not resolve`
**Cause:** Network issue inside Docker or incorrect Dockerfile.  
**Fix:**
```bash
# Clear Docker build cache
docker builder prune
docker build --no-cache -t madina-lab-yourname .
```

### Container starts but page is blank
**Cause:** Build args weren't passed during `docker build`.  
**Fix:** Make sure you pass all required `--build-arg` flags:
```bash
docker build \
  --build-arg VITE_FIREBASE_API_KEY=AIzaSy... \
  --build-arg VITE_FIREBASE_PROJECT_ID=your-project-id \
  --build-arg VITE_NAMESPACE=yourname \
  -t madina-lab-yourname .
```

### `docker: Cannot connect to the Docker daemon`
**Cause:** Docker Desktop isn't running.  
**Fix:** Start Docker Desktop, wait for it to be ready, then retry.

---

## Lab 04 — GCP Setup

### `ERROR: (gcloud) PERMISSION_DENIED`
**Cause:** Your GCP account doesn't have the required role.  
**Fix:** Ask the instructor to grant you `Editor` or `Owner` role on the project, or verify you're using the right project:
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud auth list  # Confirm active account
```

### `ERROR: secret [name] already exists`
**Cause:** Another student (or a previous run) already created this secret.  
**Fix:** This is fine — use a namespaced secret name instead:
```bash
gcloud secrets create yourname-firebase-api-key --replication-policy="automatic"
```

---

## Lab 05 — Deploy to Cloud Run

### `ERROR: build failed` during `gcloud builds submit`
**Cause:** Usually a Dockerfile issue or missing substitution variables.  
**Fix:**
```bash
# Check the build log
gcloud builds list --limit=1
gcloud builds log <BUILD_ID>

# Common fix: ensure substitution is passed
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_STUDENT_NAMESPACE=yourname .
```

### Cloud Run service shows `Container failed to start`
**Cause:** The container doesn't listen on the expected port.  
**Fix:** Ensure your app listens on port `8080` (Cloud Run default). Check with:
```bash
gcloud run services logs read madina-lab-yourname --region=us-central1 --limit=50
```

### `ERROR: (gcloud.run.services.describe) NOT_FOUND`
**Cause:** Service name or region is wrong.  
**Fix:**
```bash
# List all services to find yours
gcloud run services list --region=us-central1
```

---

## Lab 06 — CI/CD Pipeline

### Cloud Build trigger doesn't fire
**Cause:** Repository not connected, or branch pattern doesn't match.  
**Fix:**
1. Go to Cloud Build → Triggers in the GCP Console
2. Verify the trigger is connected to the correct repo
3. Check that the branch pattern matches (e.g., `^main$`)
4. Push a commit to the correct branch to trigger it

### Build succeeds but deployment fails
**Cause:** Cloud Build service account lacks permissions.  
**Fix:**
```bash
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Grant Cloud Run Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

# Grant Service Account User
gcloud iam service-accounts add-iam-policy-binding \
  ${PROJECT_NUMBER}-compute@developer.gserviceaccount.com \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

---

## Lab 07 — Terraform

### `terraform init` fails with provider errors
**Cause:** Network issue or incompatible Terraform version.  
**Fix:**
```bash
terraform -v  # Should be ≥ 1.5
rm -rf .terraform .terraform.lock.hcl
terraform init
```

### `terraform apply` — Error 409: Resource already exists
**Cause:** The Cloud Run service was already created manually (in Lab 05).  
**Fix:** Import the existing resource into Terraform state:
```bash
terraform import google_cloud_run_v2_service.app \
  projects/YOUR_PROJECT_ID/locations/us-central1/services/madina-lab-yourname
```

### `terraform destroy` hangs or fails
**Cause:** IAM bindings or dependencies blocking deletion.  
**Fix:** Try targeting specific resources:
```bash
terraform destroy -target=google_cloud_run_v2_service.app
```

---

## Lab 08 — Namespace Isolation

### Data from another student appears in your app
**Cause:** `VITE_NAMESPACE` not set or set to the same value as another student.  
**Fix:**
```bash
echo $VITE_NAMESPACE  # Should be your unique name
```
If it's wrong, update `.env` and rebuild/redeploy.

### Firestore collections look empty
**Cause:** You're looking at un-prefixed collections. Namespaced collections are prefixed.  
**Fix:** In Firebase Console, look for collections named `yourname_users`, `yourname_events`, etc.

---

## General Tips

| Symptom | First thing to check |
|---------|---------------------|
| Blank white page | Browser console (F12) for errors |
| `403 Forbidden` | IAM permissions on GCP |
| `404 Not Found` | Service name, region, or URL typo |
| `500 Internal Server Error` | Container logs via `gcloud run services logs read` |
| Build fails silently | `gcloud builds log <BUILD_ID>` |
| "Permission denied" on scripts | `chmod +x scripts/*.sh` |

## Still Stuck?

1. 🔍 **Read the error message carefully** — it usually tells you exactly what's wrong
2. 📋 **Copy the error** and search it on [Stack Overflow](https://stackoverflow.com)
3. 🙋 **Ask the instructor** — bring the exact error message and what you've tried
4. 🔄 **Start fresh** — run `./scripts/cleanup.sh yourname` and redo the lab
