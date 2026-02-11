# Lab 05: Deploy to Cloud Run

⏱️ **Duration:** 15 minutes  
📋 **Objective:** Deploy the containerized app to Google Cloud Run and access it via a public URL.

---

## 🎯 Learning Outcomes

- [ ] Submit a build to Cloud Build
- [ ] Deploy a container to Cloud Run
- [ ] Access your app via a public Cloud Run URL
- [ ] Understand serverless container hosting

---

## Step 1: Review cloudbuild.yaml

```bash
code cloudbuild.yaml
```

The pipeline has 5 steps:

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Fetch secrets | Read API keys from Secret Manager |
| 2 | Docker build | Build the container image |
| 3 | Push image | Upload to Container Registry |
| 4 | Deploy | Create/update Cloud Run service |
| 5 | Cleanup | Remove temporary build files |

---

## Step 2: Deploy! 🚀

```bash
# Deploy with your namespace
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_STUDENT_NAMESPACE=yourname .
```

> ⏳ This takes 3-5 minutes. Watch the logs!

**What's happening:**
1. Your source code is uploaded to Cloud Build
2. Secrets are fetched from Secret Manager
3. Docker image is built in the cloud
4. Image is pushed to Container Registry
5. Cloud Run service is created/updated

---

## Step 3: Find Your URL

```bash
# List Cloud Run services
gcloud run services list --region=us-central1

# Get your service URL
gcloud run services describe madina-lab-yourname \
  --region=us-central1 \
  --format='value(status.url)'
```

Open the URL in your browser — your app is live! 🎉

---

## Step 4: Add Domain to Firebase

For Google Auth to work on your deployed app:

1. Go to [Firebase Console](https://console.firebase.google.com/) → **Authentication** → **Settings**
2. Under **Authorized domains**, click **Add domain**
3. Add your Cloud Run domain: `madina-lab-yourname-HASH.run.app`

Now try signing in on your deployed app!

---

## Step 5: Verify the Deployment

```bash
# Check service health
curl https://YOUR_CLOUD_RUN_URL/health
# Expected: ok

# View logs
gcloud run services logs read madina-lab-yourname \
  --region=us-central1 --limit=20

# Check service details
gcloud run services describe madina-lab-yourname \
  --region=us-central1
```

---

## Step 6: Understand Cloud Run

| Feature | Value |
|---------|-------|
| **Scaling** | 0 to 3 instances (auto) |
| **Memory** | 256Mi per instance |
| **CPU** | 1 vCPU per instance |
| **Min instances** | 0 (scales to zero = no cost when idle) |
| **Concurrency** | 80 requests per instance (default) |

```
No traffic → 0 instances (free!)
    ↓
Request arrives → 1 instance spins up (~1 sec cold start)
    ↓
More traffic → Auto-scales up to 3 instances
    ↓
Traffic drops → Scales back to 0
```

> 💡 **Scale to zero** means you only pay when the app is being used!

---

## ✅ Checkpoint

Before moving on, confirm:

- [ ] Cloud Build completed successfully
- [ ] Cloud Run service is running
- [ ] App accessible via public URL
- [ ] Health endpoint returns "ok"
- [ ] Google Auth works on the deployed app
- [ ] Data appears in Firestore with your namespace prefix

---

## 🔗 Next Lab

➡️ [Lab 06: CI/CD Pipeline](./06-cicd-pipeline.md)
