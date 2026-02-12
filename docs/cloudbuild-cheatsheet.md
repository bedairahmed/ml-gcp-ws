# 🔄 Cloud Build & CI/CD — Quick Reference

## Cloud Build Commands

```bash
# Submit a build
gcloud builds submit --config cloudbuild-app.yaml .

# Submit with substitutions
gcloud builds submit --config cloudbuild-app.yaml \
  --substitutions=_TEAM=team1 .

# List recent builds
gcloud builds list --limit=5

# View build logs
gcloud builds log BUILD_ID

# Cancel a running build
gcloud builds cancel BUILD_ID
```

## Where to See Results

| What | Where |
|------|-------|
| Build history | Console → Cloud Build → History |
| Step logs | Click build → Expand each step |
| Build timing | Click build → Execution Details |
| Build images | Console → Artifact Registry |

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

## Security Scanning in Pipeline

### Hadolint (Dockerfile Lint)

Checks Dockerfile for best practices:
- `DL3018` — Pin versions in `apk add`
- `DL3008` — Pin versions in `apt-get`
- `DL3025` — Use JSON for CMD
- `DL3059` — Merge RUN instructions

### Trivy (Vulnerability Scan)

Scans container for CVEs:
- **LOW** — Minor issues
- **MEDIUM** — Should fix
- **HIGH** — Fix soon
- **CRITICAL** — Fix immediately

Look in Cloud Build logs for:
```
Total: 5 (HIGH: 3, CRITICAL: 2)
```