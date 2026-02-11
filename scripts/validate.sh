#!/usr/bin/env bash
# =============================================================================
# Workshop Validation Script
# Checks that each lab was completed successfully
# Usage: ./scripts/validate.sh <namespace>
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

NAMESPACE="${1:-}"
if [ -z "$NAMESPACE" ]; then
  echo -e "${RED}Usage: ./scripts/validate.sh <your-namespace>${NC}"
  echo "  Example: ./scripts/validate.sh alice"
  exit 1
fi

PASS=0
FAIL=0
SKIP=0

pass() { echo -e "  ${GREEN}✔${NC} $1"; PASS=$((PASS + 1)); }
fail() { echo -e "  ${RED}✘${NC} $1"; FAIL=$((FAIL + 1)); }
skip() { echo -e "  ${YELLOW}–${NC} $1 (skipped)"; SKIP=$((SKIP + 1)); }

PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
REGION="us-central1"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Madina Lab — Workshop Validator        ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo -e "  Namespace:  ${CYAN}${NAMESPACE}${NC}"
echo -e "  Project:    ${CYAN}${PROJECT:-not set}${NC}"
echo ""

# ---------------------------------------------------
# Lab 00: Environment Setup
# ---------------------------------------------------
echo -e "${CYAN}▸ Lab 00: Environment${NC}"
for cmd in node npm git docker gcloud terraform; do
  command -v "$cmd" &>/dev/null && pass "$cmd installed" || fail "$cmd missing"
done

# ---------------------------------------------------
# Lab 02: Firebase
# ---------------------------------------------------
echo ""
echo -e "${CYAN}▸ Lab 02: Firebase${NC}"
if [ -f ".env" ]; then
  pass ".env file exists"
  grep -q "VITE_FIREBASE_API_KEY=.\+" .env 2>/dev/null && pass "Firebase API key configured" || fail "Firebase API key missing"
  grep -q "VITE_NAMESPACE=${NAMESPACE}" .env 2>/dev/null && pass "Namespace set to ${NAMESPACE}" || fail "Namespace not set to ${NAMESPACE} in .env"
else
  fail ".env file missing"
fi

# ---------------------------------------------------
# Lab 03: Docker
# ---------------------------------------------------
echo ""
echo -e "${CYAN}▸ Lab 03: Docker${NC}"
if docker info &>/dev/null 2>&1; then
  pass "Docker is running"
  if docker images --format '{{.Repository}}' 2>/dev/null | grep -q "madina-lab"; then
    pass "Local madina-lab image exists"
  else
    skip "No local madina-lab image (may have been cleaned up)"
  fi
else
  fail "Docker not running"
fi

# ---------------------------------------------------
# Lab 04: GCP Setup
# ---------------------------------------------------
echo ""
echo -e "${CYAN}▸ Lab 04: GCP Setup${NC}"
if [ -n "$PROJECT" ]; then
  pass "GCP project configured: $PROJECT"

  # Check APIs enabled
  for api in run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com; do
    if gcloud services list --enabled --filter="name:$api" --format="value(name)" 2>/dev/null | grep -q "$api"; then
      pass "API enabled: $api"
    else
      fail "API not enabled: $api"
    fi
  done

  # Check secrets exist
  for secret in firebase-api-key firebase-project-id; do
    if gcloud secrets describe "$secret" --project="$PROJECT" &>/dev/null 2>&1; then
      pass "Secret exists: $secret"
    else
      fail "Secret missing: $secret"
    fi
  done
else
  skip "No GCP project set — skipping GCP checks"
fi

# ---------------------------------------------------
# Lab 05: Cloud Run Deployment
# ---------------------------------------------------
echo ""
echo -e "${CYAN}▸ Lab 05: Cloud Run${NC}"
SERVICE_NAME="madina-lab-${NAMESPACE}"
if [ -n "$PROJECT" ]; then
  SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="value(status.url)" 2>/dev/null || echo "")
  if [ -n "$SERVICE_URL" ]; then
    pass "Cloud Run service deployed: $SERVICE_NAME"
    pass "URL: $SERVICE_URL"

    # Health check
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/health" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
      pass "Health check passed (HTTP 200)"
    else
      fail "Health check failed (HTTP $HTTP_CODE)"
    fi
  else
    fail "Cloud Run service not found: $SERVICE_NAME"
  fi
else
  skip "No GCP project — skipping Cloud Run checks"
fi

# ---------------------------------------------------
# Lab 06: CI/CD
# ---------------------------------------------------
echo ""
echo -e "${CYAN}▸ Lab 06: CI/CD${NC}"
if [ -f "cloudbuild.yaml" ]; then
  pass "cloudbuild.yaml exists"
  grep -q "STUDENT_NAMESPACE" cloudbuild.yaml && pass "Namespace substitution configured" || fail "Missing _STUDENT_NAMESPACE in cloudbuild.yaml"
else
  fail "cloudbuild.yaml missing"
fi

# ---------------------------------------------------
# Lab 07: Terraform
# ---------------------------------------------------
echo ""
echo -e "${CYAN}▸ Lab 07: Terraform${NC}"
if [ -d "terraform" ]; then
  pass "terraform/ directory exists"
  [ -f "terraform/terraform.tfvars" ] && pass "terraform.tfvars configured" || skip "terraform.tfvars not created yet"
  [ -d "terraform/.terraform" ] && pass "Terraform initialized" || skip "Terraform not initialized yet"
else
  fail "terraform/ directory missing"
fi

# ---------------------------------------------------
# Summary
# ---------------------------------------------------
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL=$((PASS + FAIL))
echo -e "  ${GREEN}✔ $PASS passed${NC}  ${RED}✘ $FAIL failed${NC}  ${YELLOW}– $SKIP skipped${NC}  (${TOTAL} checks)"
echo ""
if [ "$FAIL" -eq 0 ]; then
  echo -e "  ${GREEN}🎉 All validations passed! Great work!${NC}"
else
  echo -e "  ${YELLOW}Review the failed checks above and re-run when fixed.${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
