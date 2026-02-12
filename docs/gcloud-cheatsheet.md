# ☁️ GCP CLI (gcloud) — Quick Reference

## Authentication & Login

### 1. **User Account Login (Standard)**
```bash
gcloud auth login                                    # Open browser-based authentication
gcloud auth login --no-launch-browser               # If browser unavailable, provides URL
gcloud auth login EMAIL@example.com                 # Login with specific email
```
> Opens browser for OAuth 2.0 consent. Best for development environments.

### 2. **Application Default Credentials (Service Account)**
```bash
gcloud auth application-default login                # For local development
gcloud auth application-default login --scopes=SCOPE # With specific scopes
gcloud auth application-default print-access-token  # Get access token
```
> Creates credentials for applications to use. Use for application-to-GCP communication.

### 3. **Service Account Key Authentication**
```bash
gcloud auth activate-service-account --key-file=PATH/TO/KEY.json
gcloud auth activate-service-account SA_EMAIL --key-file=PATH/TO/KEY.json
```
> Authenticate using a service account JSON key. Recommended for CI/CD pipelines.

### 4. **Impersonate Another Account**
```bash
gcloud auth application-default print-access-token \
  --impersonate-service-account=SA_EMAIL
```
> Useful for testing with different permissions.

### 5. **Check Current Authentication**
```bash
gcloud auth list                                     # Show all authenticated accounts
gcloud config get-value account                     # Current active account
gcloud auth print-access-token                      # Get current access token
gcloud auth print-identity-token --audiences=URL    # Get identity token (OIDC)
```

### 6. **Logout & Revoke Access**
```bash
gcloud auth revoke                                   # Revoke current account
gcloud auth revoke EMAIL@example.com                # Revoke specific account
gcloud auth application-default revoke              # Revoke application credentials
```

## Project & Config

```bash
gcloud config get-value project              # Current project
gcloud config set project PROJECT_ID         # Switch project
gcloud config list                           # All settings
gcloud config configurations list            # List all named configs
gcloud config configurations create CONFIG_NAME  # Create named config
gcloud config configurations activate CONFIG_NAME # Switch config
```

## Cloud Run

```bash
gcloud run services list                                      # List all services
gcloud run services list --region=REGION                      # Services in specific region
gcloud run services describe SERVICE --region=REGION           # Service details
gcloud run services logs read SERVICE --region=REGION --limit=50  # View recent logs
gcloud run services delete SERVICE --region=REGION             # Delete service
gcloud run revisions list --service=SERVICE --region=REGION    # List revisions
gcloud run deploy SERVICE --source=. --region=REGION           # Deploy from local code
gcloud run deploy SERVICE --image=IMAGE_URL --region=REGION    # Deploy from container image
```

## Cloud Build

```bash
gcloud builds list --limit=10                                  # Recent builds
gcloud builds log BUILD_ID                                     # Build logs
gcloud builds log BUILD_ID --stream                            # Stream build logs live
gcloud builds submit --config=FILE.yaml .                      # Submit build with config
gcloud builds submit --config=FILE.yaml --substitutions=_KEY=VAL .  # With variables
gcloud builds describe BUILD_ID                                # Build details and status
```

## Artifact Registry

```bash
gcloud artifacts repositories list --location=REGION           # List repos
gcloud artifacts repositories describe REPO --location=REGION  # Repository details
gcloud artifacts docker images list REPO_PATH                  # List container images
gcloud artifacts docker images list REPO_PATH --include-tags   # Include image tags
gcloud artifacts print-settings docker --repository=REPO --location=REGION  # Docker config
```

## Secret Manager

```bash
gcloud secrets list                                            # List all secrets
gcloud secrets describe SECRET_NAME                            # Secret details
gcloud secrets versions access latest --secret=SECRET_NAME     # Get latest secret value
gcloud secrets versions list --secret=SECRET_NAME              # List secret versions
echo -n "VALUE" | gcloud secrets create NAME --data-file=-     # Create secret from stdin
gcloud secrets versions add SECRET_NAME --data-file=-          # Add new version
gcloud secrets delete SECRET_NAME                              # Delete secret
```

## IAM

```bash
gcloud projects get-iam-policy PROJECT_ID                      # View all roles
gcloud projects get-iam-policy PROJECT_ID --flatten=bindings   # Flatten role output
gcloud iam service-accounts list                               # List service accounts
gcloud iam service-accounts describe SA_EMAIL                  # Service account details
gcloud iam service-accounts create SA_NAME                     # Create service account
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member=serviceAccount:SA_EMAIL --role=ROLE_ID              # Grant role to SA
gcloud iam service-accounts add-iam-policy-binding SA_EMAIL \
  --member=user:USER_EMAIL --role=roles/iam.serviceAccountUser  # Grant SA impersonation
```

## APIs

```bash
gcloud services list --enabled                                 # Enabled APIs
gcloud services list --available                               # Available APIs
gcloud services enable SERVICE_NAME                            # Enable API
gcloud services enable run.googleapis.com storage.googleapis.com  # Enable multiple
gcloud services disable SERVICE_NAME                           # Disable API
```

## Useful Tips & Best Practices

```bash
# Set default values to avoid typing region/project repeatedly
gcloud config set compute/region us-central1
gcloud config set compute/zone us-central1-a

# Use output format options
gcloud run services list --format=json                         # JSON output
gcloud run services list --format=table                        # Table format
gcloud run services list --format="table(name, region)"        # Custom columns

# Get help on any command
gcloud run deploy --help                                       # Command help
gcloud help auth                                               # Topic help

# Update gcloud to latest version
gcloud components update                                       # Update all components
gcloud version                                                 # Check version
```