#!/usr/bin/env bash
# =============================================================================
# Workshop Cleanup Script
# Removes all GCP resources created during the workshop
# Usage: ./scripts/cleanup.sh <namespace>
# =============================================================================

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

NAMESPACE="${1:-}"
if [ -z "$NAMESPACE" ]; then
  echo -e "${RED}Usage: ./scripts/cleanup.sh <your-namespace>${NC}"
  echo "  Example: ./scripts/cleanup.sh alice"
  exit 1
fi

PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
REGION="us-central1"
SERVICE_NAME="madina-lab-${NAMESPACE}"
IMAGE="gcr.io/${PROJECT}/${SERVICE_NAME}"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Madina Lab — Workshop Cleanup          ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo -e "  Namespace:  ${CYAN}${NAMESPACE}${NC}"
echo -e "  Project:    ${CYAN}${PROJECT}${NC}"
echo -e "  Service:    ${CYAN}${SERVICE_NAME}${NC}"
echo ""
echo -e "${YELLOW}⚠ This will delete the following resources:${NC}"
echo "  • Cloud Run service: $SERVICE_NAME"
echo "  • Container images:  $IMAGE"
echo "  • Local Docker images matching madina-lab-${NAMESPACE}"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo ""

# ---------------------------------------------------
# 1. Delete Cloud Run service
# ---------------------------------------------------
echo -e "${CYAN}▸ Deleting Cloud Run service...${NC}"
if gcloud run services describe "$SERVICE_NAME" --region="$REGION" &>/dev/null 2>&1; then
  gcloud run services delete "$SERVICE_NAME" --region="$REGION" --quiet && \
    echo -e "  ${GREEN}✔${NC} Deleted $SERVICE_NAME" || \
    echo -e "  ${RED}✘${NC} Failed to delete $SERVICE_NAME"
else
  echo -e "  ${YELLOW}–${NC} Service $SERVICE_NAME not found (already deleted?)"
fi

# ---------------------------------------------------
# 2. Delete container images from GCR
# ---------------------------------------------------
echo ""
echo -e "${CYAN}▸ Deleting container images...${NC}"
DIGESTS=$(gcloud container images list-tags "$IMAGE" --format="get(digest)" 2>/dev/null || echo "")
if [ -n "$DIGESTS" ]; then
  for digest in $DIGESTS; do
    gcloud container images delete "${IMAGE}@${digest}" --quiet --force-delete-tags 2>/dev/null && \
      echo -e "  ${GREEN}✔${NC} Deleted ${IMAGE}@${digest}" || \
      echo -e "  ${RED}✘${NC} Failed to delete ${IMAGE}@${digest}"
  done
else
  echo -e "  ${YELLOW}–${NC} No images found for $IMAGE"
fi

# ---------------------------------------------------
# 3. Clean local Docker images
# ---------------------------------------------------
echo ""
echo -e "${CYAN}▸ Cleaning local Docker images...${NC}"
LOCAL_IMAGES=$(docker images --format '{{.Repository}}:{{.Tag}}' 2>/dev/null | grep "madina-lab-${NAMESPACE}" || echo "")
if [ -n "$LOCAL_IMAGES" ]; then
  echo "$LOCAL_IMAGES" | while read -r img; do
    docker rmi "$img" 2>/dev/null && \
      echo -e "  ${GREEN}✔${NC} Removed $img" || \
      echo -e "  ${YELLOW}–${NC} Could not remove $img"
  done
else
  echo -e "  ${YELLOW}–${NC} No local images found"
fi

# ---------------------------------------------------
# 4. Terraform destroy (optional)
# ---------------------------------------------------
echo ""
echo -e "${CYAN}▸ Terraform cleanup...${NC}"
if [ -d "terraform/.terraform" ] && [ -f "terraform/terraform.tfvars" ]; then
  read -p "  Also run terraform destroy? (y/N) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd terraform
    terraform destroy -var="student_namespace=${NAMESPACE}" -auto-approve 2>&1 | tail -5
    cd ..
    echo -e "  ${GREEN}✔${NC} Terraform resources destroyed"
  else
    echo -e "  ${YELLOW}–${NC} Skipped terraform destroy"
  fi
else
  echo -e "  ${YELLOW}–${NC} Terraform not initialized — skipping"
fi

# ---------------------------------------------------
# Summary
# ---------------------------------------------------
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✔ Cleanup complete for namespace: ${NAMESPACE}${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
