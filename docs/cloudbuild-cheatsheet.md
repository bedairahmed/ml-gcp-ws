# 🔄 Cloud Build & CI/CD — Quick Reference

## Cloud Build Commands

```bash
# Submit a build
gcloud builds submit --config cloudbuild.yaml .

# Submit with substitutions (override variables)
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_TEAM=team1,_REGION=us-central1 .

# List builds
gcloud builds list                                   # All recent builds
gcloud builds list --limit=10                        # Last 10 builds
gcloud builds list --filter="status=SUCCESS"        # Filter by status
gcloud builds list --ongoing                        # Currently running builds

# View build details
gcloud builds log BUILD_ID                          # Show build logs
gcloud builds log BUILD_ID --stream                 # Stream logs live
gcloud builds describe BUILD_ID                     # Full build details
gcloud builds describe BUILD_ID --format=json       # JSON format

# Manage builds
gcloud builds cancel BUILD_ID                       # Cancel running build
gcloud builds retry BUILD_ID                        # Re-run failed build
```
> **Substitutions:** Override variables from command line. Useful for different environments.

## Where to See Results

| What | Where |
|------|-------|
| Build history | Console → Cloud Build → History |
| Step logs | Click build → Expand each step |
| Build timing | Click build → Execution Details |
| Build images | Console → Artifact Registry |
| Failed step | Expand step in UI or `gcloud builds log BUILD_ID` |

## YAML Pipeline Structure

```yaml
substitutions:
  _TEAM: "team1"                    # Variables — override with --substitutions

steps:
  - name: "gcr.io/cloud-builders/docker"   # Container to run this step in
    id: "build"                             # Step name (shown in logs)
    args: ["build", "-t", "IMAGE", "."]     # Command to run

availableSecrets:                    # Secrets from Secret Manager
  secretManager:
    - versionName: projects/PROJECT/secrets/NAME/versions/latest
      env: "ENV_VAR_NAME"

images:                              # Images to push after build
  - "us-central1-docker.pkg.dev/PROJECT/REPO/IMAGE:latest"

options:
  logging: CLOUD_LOGGING_ONLY        # Where to send logs

timeout: "600s"                      # Max build time
```

## Common Build Steps

```yaml
# Docker build and push
steps:
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "build"
      - "-t"
      - "us-central1-docker.pkg.dev/$PROJECT_ID/REPO/IMAGE:latest"
      - "-t"
      - "us-central1-docker.pkg.dev/$PROJECT_ID/REPO/IMAGE:$COMMIT_SHA"
      - "."

# Deploy to Cloud Run
  - name: "gcr.io/cloud-builders/run"
    args:
      - "deploy"
      - "SERVICE_NAME"
      - "--image"
      - "us-central1-docker.pkg.dev/$PROJECT_ID/REPO/IMAGE:latest"
      - "--region"
      - "us-central1"

# Run tests
  - name: "gcr.io/cloud-builders/docker"
    args: ["run", "IMAGE", "npm", "test"]

# Git operations (using gke-deploy for manifests)
  - name: "gcr.io/cloud-builders/gke-deploy"
    args:
      - run
      - "--filename=k8s/"
      - "--image=IMAGE:$COMMIT_SHA"
```

## Built-in Variables

| Variable | Value |
|----------|-------|
| `$PROJECT_ID` | GCP Project ID |
| `$BUILD_ID` | Build ID |
| `$COMMIT_SHA` | Git commit hash |
| `$BRANCH_NAME` | Git branch name |
| `$REPO_NAME` | Repository name |
| `$TRIGGER_NAME` | Build trigger name |

```yaml
# Example: Tag image with commit SHA
images:
  - "us-central1-docker.pkg.dev/$PROJECT_ID/REPO/APP:$COMMIT_SHA"
  - "us-central1-docker.pkg.dev/$PROJECT_ID/REPO/APP:latest"
```

### Hadolint (Dockerfile Lint)

Checks Dockerfile for best practices:
```bash
docker run --rm -i hadolint/hadolint < Dockerfile
```

Common issues:
- `DL3018` — Pin `apk add` package versions
- `DL3008` — Pin `apt-get` package versions
- `DL3025` — Use JSON array for CMD
- `DL3059` — Merge RUN instructions into one

In Cloud Build:
```yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "run"
      - "--rm"
      - "-i"
      - "hadolint/hadolint"
      - "hadolint"
      - "-"
    input: !IO
      path: Dockerfile
```

### Trivy (Container Vulnerability Scanning)

Scans built images for CVEs (Common Vulnerabilities):
```bash
trivy image IMAGE:TAG
```

Severity levels:
- **LOW** — Not urgent
- **MEDIUM** — Should address
- **HIGH** — Fix soon
- **CRITICAL** — Fix immediately

In Cloud Build (scan before pushing):
```yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "IMAGE", "."]

  - name: "gcr.io/aquasec/trivy"
    args: ["image", "--severity=HIGH,CRITICAL", "IMAGE"]

images:
  - "IMAGE"  # Only push if security scan passes
```

### Container Analysis (Automatic Post-deploy Scanning)

Vulnerability scanning runs automatically in Artifact Registry:
1. Image pushed to Artifact Registry
2. Container Analysis scans automatically
3. View results: Console → Artifact Registry → Image → Vulnerabilities

## Best Practices

```yaml
# ✅ DO: Cache docker layers to speed up builds
options:
  machineType: "N1_HIGHCPU_8"       # Faster machine for builds

# ✅ DO: Set timeout to prevent runaway builds
timeout: "1200s"

# ✅ DO: Use specific image tags, never "latest"
images:
  - "gcr.io/$PROJECT_ID/APP:$COMMIT_SHA"
  - "gcr.io/$PROJECT_ID/APP:$BRANCH_NAME"

# ✅ DO: Fail fast with security checks before pushing
steps:
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "IMAGE", "."]
  - name: "gcr.io/aquasec/trivy"
    args: ["image", "IMAGE"]        # Must pass or build fails
  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "IMAGE"]         # Only push if trivy passes

# ✅ DO: Keep build output clean
onSuccess:
  - "Delete temporary files"
```

## Common Errors & Solutions

| Error | Cause | Fix |
|-------|-------|-----|
| `Permission denied` | Missing IAM roles | Grant Cloud Build Editor role to Cloud Build service account |
| `Failed to push image` | Artifact Registry access denied | Add Cloud Build SA to Artifact Registry Writer role |
| `Build timeout` | Build takes too long | Increase `timeout` value or optimize Dockerfile |
| `Secret not found` | Wrong secret name or version | Verify secret exists: `gcloud secrets list` |
| `Image not found in Artifact Registry` | Wrong image name/region | Check image path: `us-central1-docker.pkg.dev/PROJECT/REPO/IMAGE` |
| `Step failed - Docker error` | Dockerfile syntax | Run locally: `docker build .` to debug |

## Quick Reference: Common Workflows

### Build and Push to Artifact Registry
```yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "build"
      - "-t"
      - "us-central1-docker.pkg.dev/$PROJECT_ID/repo/app:$SHORT_SHA"
      - "."

images:
  - "us-central1-docker.pkg.dev/$PROJECT_ID/repo/app:$SHORT_SHA"
```

### Deploy to Cloud Run After Build
```yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "IMAGE", "."]

  - name: "gcr.io/cloud-builders/run"
    args:
      - "deploy"
      - "service-name"
      - "--image"
      - "IMAGE"
      - "--region"
      - "us-central1"
      - "--allow-unauthenticated"
```