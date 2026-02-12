# ☁️ GCP CLI (gcloud) — Quick Reference

## Project & Config

```bash
gcloud config get-value project              # Current project
gcloud config set project PROJECT_ID         # Switch project
gcloud config list                           # All settings
gcloud auth list                             # Active accounts
```

## Cloud Run

```bash
gcloud run services list                                      # List all services
gcloud run services describe SERVICE --region=REGION           # Service details
gcloud run services logs read SERVICE --region=REGION          # View logs
gcloud run services delete SERVICE --region=REGION             # Delete service
gcloud run revisions list --service=SERVICE --region=REGION    # List revisions
```

## Cloud Build

```bash
gcloud builds list --limit=5                                   # Recent builds
gcloud builds log BUILD_ID                                     # Build logs
gcloud builds submit --config FILE.yaml .                      # Submit build
gcloud builds submit --config FILE.yaml --substitutions=_KEY=VAL .  # With variables
```

## Artifact Registry

```bash
gcloud artifacts repositories list --location=REGION           # List repos
gcloud artifacts docker images list REPO_PATH                  # List images
```

## Secret Manager

```bash
gcloud secrets list                                            # List secrets
gcloud secrets versions access latest --secret=SECRET_NAME     # View value
echo -n "VALUE" | gcloud secrets create NAME --data-file=-     # Create secret
```

## IAM

```bash
gcloud projects get-iam-policy PROJECT_ID                      # View all roles
gcloud iam service-accounts list                               # List SAs
```

## APIs

```bash
gcloud services list --enabled                                 # Enabled APIs
gcloud services enable SERVICE_NAME                            # Enable API
```