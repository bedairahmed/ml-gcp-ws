# 📝 YAML — Quick Reference

## Overview

YAML (YAML Ain't Markup Language) is used for configuration files across many tools:
- Cloud Build pipelines (`cloudbuild.yaml`)
- Kubernetes manifests (`deployment.yaml`)
- Docker Compose (`docker-compose.yml`)
- Terraform variables (`terraform.tfvars`)

**Key principle:** Uses **indentation** (not brackets) for structure. Very readable!

## Basics

```yaml
# This is a comment (lines starting with #)

# Key-value pair
name: "madina-lab"
port: 8080
enabled: true

# Nested structure (2-space indentation)
server:
  host: "localhost"
  port: 8080
  ssl: true

# Nested multiple levels
database:
  connection:
    host: "db.example.com"
    port: 5432
```
> **Indentation is critical!** Use 2 spaces (not tabs). Wrong indentation = parse errors.

## Strings

```yaml
# All of these are valid strings
name: madina-lab               # No quotes needed for simple strings
name: "madina-lab"             # Double quotes (allows special chars)
name: 'madina-lab'             # Single quotes (literal)

# Multi-line string (preserves newlines with |)
description: |                 
  This is line one.
  This is line two.
  Result has newlines.

# Multi-line string (folds into one line with >)
command: >                     
  This is all
  one line.
  Result: no newlines

# String with special characters (quote it!)
password: "my:password@123"
email: "user@example.com"
```
> **Pipes `|`:** Keep newlines. **Fold `>`:** Remove newlines. Both useful for multi-line values.

## Lists (Arrays)

```yaml
# Inline list (compact)
colors: [red, green, blue]

# Block list (one item per line, better readability)
fruits:
  - apple
  - banana
  - cherry

# List of objects
users:
  - name: Ahmed
    role: admin
  - name: Zainab
    role: user
```
> **Inline:** Good for short lists. **Block:** Better for multi-line items or documentation.

## Maps (Objects/Dictionaries)

```yaml
# Inline map
person: {name: Ahmed, role: instructor, age: 30}

# Block map (more readable)
person:
  name: Ahmed
  role: instructor
  age: 30
  contact:
    email: ahmed@example.com
    phone: "+123456789"
```
> **Inline maps:** Good for simple data. **Block maps:** Better for readability and documentation.

## Variables & Substitutions (Cloud Build)

```yaml
# Define variables
substitutions:
  _TEAM: "team1"                      # Custom variable (starts with _)
  _REGION: "us-central1"
  _IMAGE_NAME: "my-app"

# Use variables with ${_VAR} syntax
steps:
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "build"
      - "-t"
      - "us-central1-docker.pkg.dev/$PROJECT_ID/repo/${_IMAGE_NAME}:${_TEAM}"
      - "."

# Reference built-in variables (no substitutions_ prefix needed)
images:
  - "us-central1-docker.pkg.dev/$PROJECT_ID/repo/app:$COMMIT_SHA"
```

**Built-in variables:**
- `$PROJECT_ID` - GCP Project ID
- `$COMMIT_SHA` - Git commit hash
- `$BRANCH_NAME` - Git branch
- `$BUILD_ID` - Build ID

**Override from CLI:**
```bash
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_TEAM=team2,_REGION=europe-west1 .
```
> Variables make configs reusable for different environments and projects.

## Environment Variables

```yaml
# Define environment variables
env:
  - "NODE_ENV=production"
  - "PORT=8080"

# Reference in command
args:
  - "bash"
  - "-c"
  - "echo $NODE_ENV"              # Access as $VAR

# In Cloud Build — inject secret as environment variable
availableSecrets:
  secretManager:
    - versionName: "projects/PROJECT/secrets/DB_PASSWORD/versions/latest"
      env: "DB_PASSWORD"

steps:
  - name: "gcr.io/cloud-builders/docker"
    secretEnv: ["DB_PASSWORD"]     # Reference secret
    args:
      - "-c"
      - |
        echo $$DB_PASSWORD         # $$ = escaped $ in Cloud Build
        npm test
```
> **Cloud Build:** Use `$$` to escape `$` in bash scripts. Cloud Build replaces `$$` with `$` before running.

## Common Mistakes

```yaml
# ❌ WRONG — Tabs not allowed (YAML specification)
steps:
	- name: build              # Tab character = ERROR!
	  image: docker

# ✅ CORRECT — Use 2 spaces
steps:
  - name: build
    image: docker

# ❌ WRONG — Colon in value without quotes
password: my:secret:value    # Parsed as multiple key-value pairs!

# ✅ CORRECT — Quote values with special characters
password: "my:secret:value"
email: "user@example.com"
path: "/home/user/file:name"

# ❌ WRONG — No space after colon
name:value

# ✅ CORRECT — Space required after colon
name: value

# ❌ WRONG — Inconsistent indentation
server:
  host: localhost
   port: 8080              # Extra space = ERROR!

# ✅ CORRECT — Consistent 2-space indentation
server:
  host: localhost
  port: 8080

# ❌ WRONG — Missing quotes for numbers as strings
version: 1.0              # Parsed as number, not string "1.0"

# ✅ CORRECT — Quote strings that look like numbers
version: "1.0"

# ❌ WRONG — Boolean confusion
enabled: yes              # Ambiguous - might parse as string
debug: no                 # Ambiguous

# ✅ CORRECT — Use true/false or quote
enabled: true
debug: false
mode: "yes"               # If you specifically want string "yes"
```
> Most YAML errors are due to tabs vs spaces, missing quotes, or inconsistent indentation.

## Cloud Build YAML Structure

```yaml
substitutions:          # Variables (override with --substitutions)
  _KEY: "value"

steps:                  # Pipeline steps (run in order)
  - name: "image"       # Container to use
    id: "step-name"     # Name shown in logs
    entrypoint: "bash"  # Override container entrypoint
    args: ["-c", "..."] # Command arguments
    secretEnv: [...]     # Secrets for this step
    env:                # Environment variables
      - "KEY=value"

availableSecrets:       # Secret Manager references
  secretManager:
    - versionName: "projects/.../secrets/.../versions/latest"
      env: "ENV_NAME"

images:                 # Images to push after build
  - "registry/image:tag"

artifacts:              # Store build artifacts
  objects:
    location: "gs://bucket/path"
    paths: ["dist/**"]

options:
  logging: CLOUD_LOGGING_ONLY
  machineType: "N1_HIGHCPU_8"     # Machine size for build

timeout: "600s"         # Max build time (default 10 min)
```

## YAML Validation Tools

```bash
# Validate Cloud Build config
gcloud builds submit --config cloudbuild.yaml --dry-run .

# Validate Kubernetes YAML
kubectl apply -f deployment.yaml --dry-run=client

# Online validators
# https://www.yamllint.com/
# https://codebeautify.org/yaml-validator

# Local YAML linting
yamllint cloudbuild.yaml
```

## Data Types & Formatting

| Type | Example | Notes |
|------|---------|-------|
| String | `name: "Ahmed"` | Quote if contains special chars |
| Number | `port: 8080` | Don't quote pure numbers |
| Float | `version: "1.5"` | Quote to preserve precision |
| Boolean | `enabled: true` | Use `true`/`false` (not yes/no) |
| Null | `value: null` | Empty/no value |
| List | `tags: [a, b, c]` | Inline or block format |
| Map | `{key: value}` | Inline or block format |

## Best Practices

```yaml
# ✅ DO: Use meaningful step IDs for debugging
steps:
  - name: "gcr.io/cloud-builders/docker"
    id: "build-image"           # Clear, descriptive
    args: ["build", "-t", "IMAGE", "."]

# ✅ DO: Add comments for complex configurations
# Build Docker image with commit SHA tag
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "build"
      - "-t"
      - "us-central1-docker.pkg.dev/$PROJECT_ID/repo/app:$COMMIT_SHA"
      - "."

# ✅ DO: Use built-in variables instead of hardcoding
images:
  - "gcr.io/$PROJECT_ID/app:$COMMIT_SHA"
  - "gcr.io/$PROJECT_ID/app:$BRANCH_NAME"

# ✅ DO: Organize substitutions logically
substitutions:
  # Project settings
  _REGION: "us-central1"
  # Application config
  _APP_NAME: "my-service"
  _IMAGE_REPO: "us-central1-docker.pkg.dev"

# ❌ DON'T: Hardcode project-specific values
images:
  - "gcr.io/my-actual-project-123/app:abc123def"

# ❌ DON'T: Mix inline and block syntax inconsistently
steps:
  - name: step1
    args: [a, b, c]           # OK - short list
  
  - name: step2
    args:                      # Better - readable
      - longer
      - argument
      - list
```

## Quick Copy-Paste Templates

### Simple Build & Push
```yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "IMAGE", "."]

images:
  - "IMAGE"
```

### Build with Secrets
```yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    secretEnv: ["API_KEY"]
    args: ["run", "IMAGE", "npm", "test"]

availableSecrets:
  secretManager:
    - versionName: "projects/PROJECT/secrets/API_KEY/versions/latest"
      env: "API_KEY"
```

### Multi-line Bash Script
```yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    entrypoint: "bash"
    args:
      - "-c"
      - |
        echo "Starting deployment..."
        if [ -f config.yml ]; then
          echo "Config found"
        fi
        npm run build
```