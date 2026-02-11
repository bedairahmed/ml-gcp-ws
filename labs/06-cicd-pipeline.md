# Lab 06: CI/CD Pipeline

⏱️ **Duration:** 20 minutes  
📋 **Objective:** Understand CI/CD concepts and make a code change that automatically deploys.

---

## 🎯 Learning Outcomes

- [ ] Understand CI/CD pipeline concepts
- [ ] Make a code change and trigger a build
- [ ] Monitor build progress in Cloud Console
- [ ] Verify the change is deployed automatically

---

## Step 1: Understand CI/CD

```
CI (Continuous Integration)          CD (Continuous Deployment)
┌────────────────────────┐          ┌────────────────────────┐
│ Developer pushes code  │          │ Build succeeds         │
│ → Automated build      │────────▶│ → Auto-deploy to       │
│ → Run tests            │          │   Cloud Run            │
│ → Build Docker image   │          │ → Live in production   │
└────────────────────────┘          └────────────────────────┘
```

| Term | Meaning |
|------|---------|
| **CI** | Automatically build & test on every code push |
| **CD** | Automatically deploy successful builds |
| **Pipeline** | The sequence of automated steps |
| **Trigger** | What starts the pipeline (push, PR, manual) |

---

## Step 2: Set Up a Cloud Build Trigger (Optional)

To auto-deploy on every `git push`:

1. Go to [Cloud Build Console](https://console.cloud.google.com/cloud-build/triggers)
2. Click **Create Trigger**
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `madina-lab-deploy` |
| Event | Push to branch |
| Branch | `^main$` |
| Config | Cloud Build config file |
| Config path | `cloudbuild.yaml` |
| Substitution | `_STUDENT_NAMESPACE` = `yourname` |

4. Click **Create**

Now every push to `main` will auto-deploy!

---

## Step 3: Make a Code Change

Let's make a visible change to prove CI/CD works.

Edit `src/pages/Landing.tsx` — find the hero tagline and modify it:

```tsx
// Find this line (or similar):
"Your Digital Community Companion"

// Change it to:
"Your Digital Community Companion — Deployed by [YourName]! 🚀"
```

---

## Step 4: Push and Deploy

### Option A: With Trigger (auto-deploy)

```bash
git add .
git commit -m "feat: personalize landing page"
git push origin main
```

The trigger fires automatically!

### Option B: Manual Build

```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_STUDENT_NAMESPACE=yourname .
```

---

## Step 5: Monitor the Build

1. Go to [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)
2. Click on your running build
3. Watch the logs in real-time

You'll see each step execute:
```
Step 1/5: Fetching secrets...     ✅
Step 2/5: Building Docker image...✅
Step 3/5: Pushing image...        ✅
Step 4/5: Deploying to Cloud Run..✅
Step 5/5: Cleaning up...          ✅
```

---

## Step 6: Verify the Deployment

Once the build completes (3-5 minutes):

1. Open your Cloud Run URL
2. You should see your personalized tagline! 🎉
3. Hard-refresh (`Ctrl+Shift+R`) if you see the old version

---

## Step 7: View Build History

```bash
# List recent builds
gcloud builds list --limit=5

# View a specific build's logs
gcloud builds log BUILD_ID
```

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Immutable deploys** | Each deploy creates a new container — never modifies the running one |
| **Rollback** | Deploy a previous image to instantly revert |
| **Blue-green** | Cloud Run routes traffic to the new version only when it's healthy |
| **Build substitutions** | Variables like `_STUDENT_NAMESPACE` customize builds without changing code |

---

## ✅ Checkpoint

Before moving on, confirm:

- [ ] You understand the CI/CD pipeline steps
- [ ] Code change committed and pushed
- [ ] Build completed successfully in Cloud Build
- [ ] Change visible on your live Cloud Run URL
- [ ] You can view build history and logs

---

## 🔗 Next Lab

➡️ [Lab 07: Infrastructure as Code](./07-terraform.md)
