# 📝 YAML — Quick Reference

## Basics

```yaml
# This is a comment

# Key-value pair
name: "madina-lab"
port: 8080
enabled: true

# Nested (use 2-space indent)
server:
  host: "localhost"
  port: 8080
```

## Strings

```yaml
# All of these are valid strings
name: madina-lab               # No quotes needed for simple strings
name: "madina-lab"             # Double quotes (allows special chars)
name: 'madina-lab'             # Single quotes (literal)

# Multi-line
description: |                 # Keeps newlines
  This is line one.
  This is line two.

command: >                     # Folds into one line
  This is all
  one line.
```

## Lists

```yaml
# Inline list
colors: [red, green, blue]

# Block list (one item per line)
fruits:
  - apple
  - banana
  - cherry
```

## Maps (Objects)

```yaml
# Inline
person: {name: Ahmed, role: instructor}

# Block
person:
  name: Ahmed
  role: instructor
```

## Variables & Substitutions (Cloud Build)

```yaml
substitutions:
  _TEAM: "team1"                    # Define variable
  _REGION: "us-central1"

steps:
  - name: "gcr.io/cloud-builders/docker"
    args:
      - "build"
      - "-t"
      - "image-${_TEAM}"            # Use variable with ${_VAR}
```

## Environment Variables

```yaml
# In Cloud Build — inject secret as env var
secretEnv:
  - "FIREBASE_API_KEY"              # Available as $$FIREBASE_API_KEY in bash

# Reference with double dollar sign
args:
  - "-c"
  - |
    echo $$FIREBASE_API_KEY         # $$ = escaped $ in Cloud Build
```

## Common Mistakes

```yaml
# ❌ WRONG — tabs not allowed (use spaces)
name:
	value: bad

# ✅ CORRECT — 2-space indent
name:
  value: good

# ❌ WRONG — colon in value without quotes
password: my:secret

# ✅ CORRECT — quote values with special chars
password: "my:secret"

# ❌ WRONG — no space after colon
name:value

# ✅ CORRECT
name: value
```

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

availableSecrets:       # Secret Manager references
  secretManager:
    - versionName: "projects/.../secrets/.../versions/latest"
      env: "ENV_NAME"

images:                 # Images to push after build
  - "registry/image:tag"

options:
  logging: CLOUD_LOGGING_ONLY

timeout: "600s"         # Max build time
```