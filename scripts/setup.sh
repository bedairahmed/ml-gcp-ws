#!/usr/bin/env bash
# =============================================================================
# Workshop Setup Script
# Verifies prerequisites and prepares the local environment
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✔${NC} $1"; }
fail() { echo -e "  ${RED}✘${NC} $1"; ERRORS=$((ERRORS + 1)); }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
ERRORS=0

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Madina Lab — Workshop Setup            ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ---------------------------------------------------
# 1. Check required CLI tools
# ---------------------------------------------------
echo "▸ Checking prerequisites..."

for cmd in node npm git docker gcloud terraform; do
  if command -v "$cmd" &>/dev/null; then
    version=$($cmd --version 2>&1 | head -1)
    pass "$cmd  →  $version"
  else
    fail "$cmd is not installed"
  fi
done

# Node version check (>= 18)
if command -v node &>/dev/null; then
  NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 18 ]; then
    pass "Node.js version >= 18"
  else
    fail "Node.js version must be >= 18 (found v$NODE_MAJOR)"
  fi
fi

# Docker running check
if docker info &>/dev/null 2>&1; then
  pass "Docker daemon is running"
else
  fail "Docker daemon is not running — start Docker Desktop"
fi

# ---------------------------------------------------
# 2. Check gcloud auth
# ---------------------------------------------------
echo ""
echo "▸ Checking GCP authentication..."

if gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | grep -q "@"; then
  ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null | head -1)
  pass "Authenticated as $ACCOUNT"
else
  fail "Not authenticated — run: gcloud auth login"
fi

PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
if [ -n "$PROJECT" ]; then
  pass "GCP project set to $PROJECT"
else
  warn "No GCP project set — run: gcloud config set project YOUR_PROJECT_ID"
fi

# ---------------------------------------------------
# 3. Install npm dependencies
# ---------------------------------------------------
echo ""
echo "▸ Installing npm dependencies..."

if [ -f "package.json" ]; then
  npm install --silent 2>/dev/null && pass "npm install complete" || fail "npm install failed"
else
  fail "package.json not found — are you in the project root?"
fi

# ---------------------------------------------------
# 4. Check .env file
# ---------------------------------------------------
echo ""
echo "▸ Checking environment configuration..."

if [ -f ".env" ]; then
  pass ".env file exists"
  for var in VITE_FIREBASE_API_KEY VITE_FIREBASE_PROJECT_ID VITE_NAMESPACE; do
    if grep -q "^${var}=.\+" .env 2>/dev/null; then
      pass "$var is set"
    else
      warn "$var is missing or empty in .env"
    fi
  done
else
  warn ".env file not found — run: cp .env.example .env"
fi

# ---------------------------------------------------
# Summary
# ---------------------------------------------------
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$ERRORS" -eq 0 ]; then
  echo -e "${GREEN}✔ All checks passed! You're ready for the workshop.${NC}"
else
  echo -e "${RED}✘ $ERRORS issue(s) found. Please fix them before continuing.${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
