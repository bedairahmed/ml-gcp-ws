#!/usr/bin/env bash
# =============================================================================
#  🕌  Madina Lab — Workshop Infrastructure Setup (v5)
# =============================================================================
#  IDEMPOTENT: Safe to run multiple times. Checks what exists, only creates
#  what's missing. No duplicates, no errors on re-run.
#
#  Architecture:
#    - VPC network + subnet (for demo/visibility)
#    - Cloud DNS zone + CNAME records (lab.ml-gcp.cloud-people.net)
#    - 7 shared secrets (Firebase config)
#    - 9 service accounts (instructor-sa + team1-sa through team8-sa)
#    - Cloud Build SA + Compute SA with full deploy permissions
#    - 1 Google Group for student IAM (viewer + build trigger)
#    - Firestore security rules (deployed via REST API — no Firebase CLI needed)
#
#  Before running:
#    1. Student accounts created in admin.google.com
#    2. Group workshop-students@ml-gcp.cloud-people.net created with all members
#    3. NS delegation for lab.ml-gcp.cloud-people.net at your DNS provider:
#       lab.ml-gcp.cloud-people.net  NS  ns-cloud-c1.googledomains.com.
#       lab.ml-gcp.cloud-people.net  NS  ns-cloud-c2.googledomains.com.
#       lab.ml-gcp.cloud-people.net  NS  ns-cloud-c3.googledomains.com.
#       lab.ml-gcp.cloud-people.net  NS  ns-cloud-c4.googledomains.com.
#
#  Usage:  chmod +x setup.sh && ./setup.sh
# =============================================================================

set -euo pipefail

G='\033[0;32m'; R='\033[0;31m'; Y='\033[1;33m'; C='\033[0;36m'; B='\033[1m'; N='\033[0m'
ok()   { echo -e "  ${G}✔${N} $1"; }
err()  { echo -e "  ${R}✘${N} $1"; ERRORS=$((ERRORS + 1)); }
warn() { echo -e "  ${Y}⚠${N} $1"; }
info() { echo -e "  ${C}▸${N} $1"; }
skip() { echo -e "  ${C}↳${N} $1 (exists)"; }
hdr()  { echo ""; echo -e "${B}${C}──── $1 ────${N}"; }
ERRORS=0
CREATED=0
SKIPPED=0

# ── CONFIG ───────────────────────────────────────────────
PROJECT_ID="ml-gcp-workshop-487117"
REGION="us-central1"
ZONE="${REGION}-a"
DOMAIN="ml-gcp.cloud-people.net"
LAB_DOMAIN="lab.${DOMAIN}"
DNS_ZONE_NAME="lab-zone"
AR_REPO="madina-lab"
STUDENT_GROUP="workshop-students@${DOMAIN}"
NUM_TEAMS=8
TEAMS="instructor team1 team2 team3 team4 team5 team6 team7 team8"

# VPC
VPC_NAME="madina-lab-vpc"
SUBNET_NAME="madina-lab-subnet"
SUBNET_RANGE="10.10.0.0/24"

# Firebase config
FB_API_KEY="AIzaSyBYLiibKIgZ1Jl0migaQ3LWMjgSw1xXSoQ"
FB_AUTH_DOMAIN="${PROJECT_ID}.firebaseapp.com"
FB_PROJECT_ID="${PROJECT_ID}"
FB_STORAGE_BUCKET="${PROJECT_ID}.firebasestorage.app"
FB_SENDER_ID="202948511064"
FB_APP_ID="1:202948511064:web:3dcf23fcb6085770f1d12d"
FB_MEASUREMENT_ID="G-DFSPPPBQ6P"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║          🕌  Madina Lab — Workshop Setup v5  🕌         ║"
echo "║                  (idempotent — safe to re-run)          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo -e "  Project:  ${C}${PROJECT_ID}${N}"
echo -e "  Region:   ${C}${REGION}${N}"
echo -e "  VPC:      ${C}${VPC_NAME} (${SUBNET_RANGE})${N}"
echo -e "  Domain:   ${C}${LAB_DOMAIN}${N}"
echo -e "  Teams:    ${C}instructor + team1-team${NUM_TEAMS}${N}"
echo -e "  Group:    ${C}${STUDENT_GROUP}${N}"

# ═════════════════════════════════════════════════════════
# 1/9  PROJECT & APIs
# ═════════════════════════════════════════════════════════
hdr "1/9  Project & APIs"

gcloud config set project "$PROJECT_ID" 2>/dev/null
ok "Project: $PROJECT_ID"

REQUIRED_APIS=(
  compute.googleapis.com
  dns.googleapis.com
  run.googleapis.com
  artifactregistry.googleapis.com
  cloudbuild.googleapis.com
  secretmanager.googleapis.com
  firebase.googleapis.com
  firestore.googleapis.com
  firebaserules.googleapis.com
  identitytoolkit.googleapis.com
  storage.googleapis.com
)

ENABLED_APIS=$(gcloud services list --enabled --format="value(name)" 2>/dev/null)

for api in "${REQUIRED_APIS[@]}"; do
  if echo "$ENABLED_APIS" | grep -q "$api"; then
    skip "$api"
    SKIPPED=$((SKIPPED + 1))
  else
    gcloud services enable "$api" 2>/dev/null && \
      ok "$api (enabled)" && CREATED=$((CREATED + 1)) || err "$api FAILED"
  fi
done

# ═════════════════════════════════════════════════════════
# 2/9  VPC NETWORK & SUBNET
# ═════════════════════════════════════════════════════════
hdr "2/9  VPC Network & Subnet"

if gcloud compute networks describe "$VPC_NAME" --project="$PROJECT_ID" &>/dev/null 2>&1; then
  skip "VPC: $VPC_NAME"
  SKIPPED=$((SKIPPED + 1))
else
  gcloud compute networks create "$VPC_NAME" \
    --project="$PROJECT_ID" \
    --subnet-mode=custom \
    --description="Madina Lab workshop VPC" \
    --bgp-routing-mode=regional 2>/dev/null && \
    ok "VPC created: $VPC_NAME" && CREATED=$((CREATED + 1)) || err "VPC creation failed"
fi

if gcloud compute networks subnets describe "$SUBNET_NAME" --region="$REGION" --project="$PROJECT_ID" &>/dev/null 2>&1; then
  skip "Subnet: $SUBNET_NAME ($SUBNET_RANGE)"
  SKIPPED=$((SKIPPED + 1))
else
  gcloud compute networks subnets create "$SUBNET_NAME" \
    --project="$PROJECT_ID" \
    --network="$VPC_NAME" \
    --region="$REGION" \
    --range="$SUBNET_RANGE" \
    --description="Madina Lab workshop subnet" \
    --enable-private-ip-google-access 2>/dev/null && \
    ok "Subnet created: $SUBNET_NAME ($SUBNET_RANGE)" && CREATED=$((CREATED + 1)) || err "Subnet creation failed"
fi

FW_INTERNAL="madina-lab-allow-internal"
if gcloud compute firewall-rules describe "$FW_INTERNAL" --project="$PROJECT_ID" &>/dev/null 2>&1; then
  skip "Firewall: $FW_INTERNAL"
  SKIPPED=$((SKIPPED + 1))
else
  gcloud compute firewall-rules create "$FW_INTERNAL" \
    --project="$PROJECT_ID" \
    --network="$VPC_NAME" \
    --allow=tcp,udp,icmp \
    --source-ranges="$SUBNET_RANGE" \
    --description="Allow internal traffic within workshop subnet" 2>/dev/null && \
    ok "Firewall created: $FW_INTERNAL" && CREATED=$((CREATED + 1)) || err "Firewall creation failed"
fi

FW_EXTERNAL="madina-lab-allow-ssh-http"
if gcloud compute firewall-rules describe "$FW_EXTERNAL" --project="$PROJECT_ID" &>/dev/null 2>&1; then
  skip "Firewall: $FW_EXTERNAL"
  SKIPPED=$((SKIPPED + 1))
else
  gcloud compute firewall-rules create "$FW_EXTERNAL" \
    --project="$PROJECT_ID" \
    --network="$VPC_NAME" \
    --allow=tcp:22,tcp:80,tcp:443,tcp:8080 \
    --source-ranges="0.0.0.0/0" \
    --target-tags="workshop" \
    --description="Allow SSH, HTTP, HTTPS for workshop demos" 2>/dev/null && \
    ok "Firewall created: $FW_EXTERNAL" && CREATED=$((CREATED + 1)) || err "Firewall creation failed"
fi

# ═════════════════════════════════════════════════════════
# 3/9  CLOUD DNS — Zone + CNAME records
# ═════════════════════════════════════════════════════════
hdr "3/9  Cloud DNS (${LAB_DOMAIN})"

# Create DNS zone
if gcloud dns managed-zones describe "$DNS_ZONE_NAME" --project="$PROJECT_ID" &>/dev/null 2>&1; then
  skip "DNS zone: $DNS_ZONE_NAME ($LAB_DOMAIN)"
  SKIPPED=$((SKIPPED + 1))
else
  gcloud dns managed-zones create "$DNS_ZONE_NAME" \
    --dns-name="${LAB_DOMAIN}." \
    --description="Madina Lab workshop DNS" \
    --visibility=public 2>/dev/null && \
    ok "DNS zone created: $DNS_ZONE_NAME" && CREATED=$((CREATED + 1)) || err "DNS zone creation failed"
fi

# Create CNAME records for all teams (pointing to ghs.googlehosted.com for Cloud Run domain mapping)
EXISTING_RECORDS=$(gcloud dns record-sets list --zone="$DNS_ZONE_NAME" --format="value(name)" 2>/dev/null)

for team in $TEAMS; do
  RECORD_NAME="${team}.${LAB_DOMAIN}."
  if echo "$EXISTING_RECORDS" | grep -q "$RECORD_NAME"; then
    skip "CNAME: ${team}.${LAB_DOMAIN}"
  else
    gcloud dns record-sets create "$RECORD_NAME" \
      --zone="$DNS_ZONE_NAME" \
      --type=CNAME \
      --ttl=300 \
      --rrdatas="ghs.googlehosted.com." 2>/dev/null && \
      ok "CNAME created: ${team}.${LAB_DOMAIN} → ghs.googlehosted.com" && CREATED=$((CREATED + 1)) || err "CNAME failed: $team"
  fi
done

info "NS records (add these at your DNS provider ONE TIME):"
NS_SERVERS=$(gcloud dns managed-zones describe "$DNS_ZONE_NAME" --format="value(nameServers)" 2>/dev/null)
for ns in $(echo "$NS_SERVERS" | tr ';' '\n'); do
  info "  ${LAB_DOMAIN}  NS  ${ns}"
done

# ═════════════════════════════════════════════════════════
# 4/9  ARTIFACT REGISTRY & FIRESTORE
# ═════════════════════════════════════════════════════════
hdr "4/9  Artifact Registry & Firestore"

if gcloud artifacts repositories describe "$AR_REPO" --location="$REGION" &>/dev/null 2>&1; then
  skip "Artifact Registry: $AR_REPO"
  SKIPPED=$((SKIPPED + 1))
else
  gcloud artifacts repositories create "$AR_REPO" \
    --repository-format=docker --location="$REGION" \
    --description="Madina Lab Docker images" 2>/dev/null && \
    ok "Created: $AR_REPO" && CREATED=$((CREATED + 1)) || err "Artifact Registry FAILED"
fi

if gcloud firestore databases describe --project="$PROJECT_ID" &>/dev/null 2>&1; then
  skip "Firestore: (default)"
  SKIPPED=$((SKIPPED + 1))
else
  err "Firestore not found — create via Firebase Console"
fi

# ═════════════════════════════════════════════════════════
# 5/9  SECRET MANAGER (7 shared secrets)
# ═════════════════════════════════════════════════════════
hdr "5/9  Secret Manager (7 shared secrets)"

declare -A SECRETS=(
  ["firebase-api-key"]="$FB_API_KEY"
  ["firebase-auth-domain"]="$FB_AUTH_DOMAIN"
  ["firebase-project-id"]="$FB_PROJECT_ID"
  ["firebase-storage-bucket"]="$FB_STORAGE_BUCKET"
  ["firebase-messaging-sender-id"]="$FB_SENDER_ID"
  ["firebase-app-id"]="$FB_APP_ID"
  ["firebase-measurement-id"]="$FB_MEASUREMENT_ID"
)

for name in "${!SECRETS[@]}"; do
  val="${SECRETS[$name]}"
  if gcloud secrets describe "$name" &>/dev/null 2>&1; then
    CURRENT=$(gcloud secrets versions access latest --secret="$name" 2>/dev/null || echo "")
    if [ "$CURRENT" = "$val" ]; then
      skip "$name"
      SKIPPED=$((SKIPPED + 1))
    else
      echo -n "$val" | gcloud secrets versions add "$name" --data-file=- 2>/dev/null && \
        ok "$name (updated)" && CREATED=$((CREATED + 1)) || err "$name"
    fi
  else
    echo -n "$val" | gcloud secrets create "$name" --data-file=- --replication-policy=automatic 2>/dev/null && \
      ok "$name (created)" && CREATED=$((CREATED + 1)) || err "$name"
  fi
done

# ═════════════════════════════════════════════════════════
# 6/9  SERVICE ACCOUNTS (instructor + 8 teams)
# ═════════════════════════════════════════════════════════
hdr "6/9  Service accounts (instructor + ${NUM_TEAMS} teams)"

for team in $TEAMS; do
  SA_NAME="${team}-sa"
  SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

  if gcloud iam service-accounts describe "$SA_EMAIL" &>/dev/null 2>&1; then
    skip "$SA_NAME"
    SKIPPED=$((SKIPPED + 1))
  else
    gcloud iam service-accounts create "$SA_NAME" \
      --display-name="${team} Cloud Run SA" 2>/dev/null && \
      ok "$SA_NAME created" && CREATED=$((CREATED + 1)) || err "$SA_NAME failed"
    sleep 2
  fi

  for role in roles/datastore.user roles/secretmanager.secretAccessor; do
    EXISTING=$(gcloud projects get-iam-policy "$PROJECT_ID" \
      --flatten="bindings[].members" \
      --filter="bindings.role:$role AND bindings.members:serviceAccount:$SA_EMAIL" \
      --format="value(bindings.role)" 2>/dev/null)
    if [ -n "$EXISTING" ]; then
      skip "  $SA_NAME → $role"
    else
      gcloud projects add-iam-policy-binding "$PROJECT_ID" \
        --member="serviceAccount:${SA_EMAIL}" --role="$role" \
        --condition=None --quiet 2>/dev/null && \
        ok "  $SA_NAME → $role" && CREATED=$((CREATED + 1)) || warn "  $role binding failed"
    fi
  done
done

# ═════════════════════════════════════════════════════════
# 7/9  CLOUD BUILD & COMPUTE SA PERMISSIONS
# ═════════════════════════════════════════════════════════
hdr "7/9  Cloud Build & Compute SA permissions"

PN=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)" 2>/dev/null)
CB_SA="${PN}@cloudbuild.gserviceaccount.com"
COMPUTE_SA="${PN}-compute@developer.gserviceaccount.com"

info "Cloud Build SA: $CB_SA"
info "Compute SA:     $COMPUTE_SA"

CURRENT_POLICY=$(gcloud projects get-iam-policy "$PROJECT_ID" --format=json 2>/dev/null)

bind_role() {
  local SA="$1"
  local ROLE="$2"
  local LABEL="$3"

  if echo "$CURRENT_POLICY" | grep -q "$SA" && echo "$CURRENT_POLICY" | grep -q "$ROLE"; then
    skip "$LABEL → $ROLE"
  else
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
      --member="serviceAccount:${SA}" --role="$ROLE" \
      --condition=None --quiet 2>/dev/null && \
      ok "$LABEL → $ROLE" && CREATED=$((CREATED + 1)) || warn "$ROLE (may exist)"
  fi
}

# Cloud Build SA roles
for role in roles/run.admin roles/iam.serviceAccountUser roles/artifactregistry.writer \
  roles/secretmanager.secretAccessor roles/logging.logWriter; do
  bind_role "$CB_SA" "$role" "CB SA"
done

# Default Compute SA roles (Cloud Build uses this in newer projects)
for role in roles/run.admin roles/iam.serviceAccountUser roles/artifactregistry.writer \
  roles/secretmanager.secretAccessor roles/logging.logWriter roles/storage.admin \
  roles/run.invoker; do
  bind_role "$COMPUTE_SA" "$role" "Compute SA"
done

# ═════════════════════════════════════════════════════════
# 8/9  STUDENT GROUP IAM
# ═════════════════════════════════════════════════════════
hdr "8/9  Student group IAM (read-only + build trigger)"

info "Group: $STUDENT_GROUP"

for role in roles/viewer roles/cloudbuild.builds.editor roles/logging.viewer; do
  if echo "$CURRENT_POLICY" | grep -q "$STUDENT_GROUP" && echo "$CURRENT_POLICY" | grep -q "$role"; then
    skip "Group → $role"
  else
    gcloud projects add-iam-policy-binding "$PROJECT_ID" \
      --member="group:${STUDENT_GROUP}" --role="$role" \
      --condition=None --quiet 2>/dev/null && \
      ok "$role" && CREATED=$((CREATED + 1)) || warn "$role (create group first if this fails)"
  fi
done

# ═════════════════════════════════════════════════════════
# 9/9  FIRESTORE SECURITY RULES (via REST API)
# ═════════════════════════════════════════════════════════
hdr "9/9  Firestore security rules"

info "Deploying via REST API (no Firebase CLI required)"

ACCESS_TOKEN=$(gcloud auth print-access-token 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
  err "Could not get access token — run gcloud auth login first"
else
  RULES_RESPONSE=$(curl -s -X POST \
    "https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/rulesets" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
      "source": {
        "files": [
          {
            "name": "firestore.rules",
            "content": "rules_version = '\''2'\'';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    function isAuth() { return request.auth != null; }\n    function isOwner(uid) { return isAuth() && request.auth.uid == uid; }\n    function getRole() { return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role; }\n    function isAdmin() { return isAuth() && getRole() == '\''admin'\''; }\n    function isMod() { return isAuth() && (getRole() == '\''admin'\'' || getRole() == '\''moderator'\''); }\n\n    match /users/{uid} {\n      allow read: if isAuth();\n      allow create: if isOwner(uid);\n      allow update: if isOwner(uid) || isAdmin();\n      allow delete: if isAdmin();\n    }\n    match /groups/{id} { allow read: if isAuth(); allow create, update, delete: if isAdmin(); }\n    match /chat_messages/{id} { allow read, create: if isAuth(); allow update: if isAuth() && (resource.data.userId == request.auth.uid || isMod()); allow delete: if isMod(); }\n    match /events/{id} { allow read: if isAuth(); allow create: if isMod(); allow update: if isMod() || (isAuth() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['\''rsvpCount'\'','\''rsvpUsers'\''])); allow delete: if isAdmin(); }\n    match /announcements/{id} { allow read: if isAuth(); allow create, update, delete: if isAdmin(); }\n    match /businesses/{id} { allow read, create: if isAuth(); allow update: if isAuth() && (resource.data.ownerUid == request.auth.uid || isAdmin()); allow delete: if isAdmin();\n      match /reviews/{rid} { allow read, create: if isAuth(); allow update: if isAuth() && (resource.data.userId == request.auth.uid || isAdmin()); allow delete: if isAdmin(); }\n    }\n    match /business_claims/{id} { allow read: if isAuth() && (resource.data.userId == request.auth.uid || isAdmin()); allow create: if isAuth(); allow update, delete: if isAdmin(); }\n    match /notifications/{id} { allow read, update, delete: if isAuth() && resource.data.userId == request.auth.uid; allow create: if isAuth(); }\n    match /direct_messages/{id} { allow read: if isAuth() && request.auth.uid in resource.data.participants; allow create: if isAuth(); allow update: if isAuth() && request.auth.uid in resource.data.participants;\n      match /messages/{mid} { allow read, create: if isAuth(); allow update: if isAuth() && resource.data.senderId == request.auth.uid; }\n    }\n    match /{col}/{doc} { allow read, write: if isAuth(); }\n  }\n}"
          }
        ]
      }
    }' 2>/dev/null)

  RULESET_NAME=$(echo "$RULES_RESPONSE" | grep -o '"name": *"[^"]*"' | head -1 | cut -d'"' -f4)

  if [ -z "$RULESET_NAME" ]; then
    warn "Could not create ruleset — check if firebaserules.googleapis.com API is enabled"
    info "Response: $RULES_RESPONSE"
  else
    ok "Ruleset created: $RULESET_NAME"

    RELEASE_RESPONSE=$(curl -s -X PATCH \
      "https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases/cloud.firestore" \
      -H "Authorization: Bearer ${ACCESS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{
        \"release\": {
          \"name\": \"projects/${PROJECT_ID}/releases/cloud.firestore\",
          \"rulesetName\": \"${RULESET_NAME}\"
        }
      }" 2>/dev/null)

    if echo "$RELEASE_RESPONSE" | grep -q "rulesetName"; then
      ok "Firestore rules deployed successfully"
      CREATED=$((CREATED + 1))
    else
      RELEASE_RESPONSE=$(curl -s -X POST \
        "https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases" \
        -H "Authorization: Bearer ${ACCESS_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
          \"name\": \"projects/${PROJECT_ID}/releases/cloud.firestore\",
          \"rulesetName\": \"${RULESET_NAME}\"
        }" 2>/dev/null)

      if echo "$RELEASE_RESPONSE" | grep -q "rulesetName"; then
        ok "Firestore rules deployed successfully (first release)"
        CREATED=$((CREATED + 1))
      else
        warn "Could not release rules — paste them manually in Firebase Console"
        info "Response: $RELEASE_RESPONSE"
      fi
    fi
  fi
fi

# ═════════════════════════════════════════════════════════
# FINAL VALIDATION & SUMMARY
# ═════════════════════════════════════════════════════════
echo ""
echo -e "${B}${C}──── Final Validation ────${N}"

V_PASS=0; V_FAIL=0

check() {
  if eval "$2" &>/dev/null 2>&1; then
    ok "$1"
    V_PASS=$((V_PASS + 1))
  else
    err "$1"
    V_FAIL=$((V_FAIL + 1))
  fi
}

check "VPC: $VPC_NAME" \
  "gcloud compute networks describe $VPC_NAME --project=$PROJECT_ID"

check "Subnet: $SUBNET_NAME" \
  "gcloud compute networks subnets describe $SUBNET_NAME --region=$REGION --project=$PROJECT_ID"

check "DNS zone: $DNS_ZONE_NAME" \
  "gcloud dns managed-zones describe $DNS_ZONE_NAME --project=$PROJECT_ID"

check "Artifact Registry: $AR_REPO" \
  "gcloud artifacts repositories describe $AR_REPO --location=$REGION"

check "Firestore database" \
  "gcloud firestore databases describe --project=$PROJECT_ID"

SECRET_COUNT=$(gcloud secrets list --format="value(name)" 2>/dev/null | wc -l)
[ "$SECRET_COUNT" -ge 7 ] && ok "Secrets: $SECRET_COUNT/7" && V_PASS=$((V_PASS + 1)) \
  || (err "Secrets: $SECRET_COUNT/7" && V_FAIL=$((V_FAIL + 1)))

SA_COUNT=0
for team in $TEAMS; do
  SA="${team}-sa@${PROJECT_ID}.iam.gserviceaccount.com"
  gcloud iam service-accounts describe "$SA" &>/dev/null 2>&1 && SA_COUNT=$((SA_COUNT + 1))
done
[ "$SA_COUNT" -ge 9 ] && ok "Service accounts: $SA_COUNT/9" && V_PASS=$((V_PASS + 1)) \
  || (err "Service accounts: $SA_COUNT/9" && V_FAIL=$((V_FAIL + 1)))

CNAME_COUNT=$(gcloud dns record-sets list --zone="$DNS_ZONE_NAME" --filter="type=CNAME" --format="value(name)" 2>/dev/null | wc -l)
[ "$CNAME_COUNT" -ge 9 ] && ok "DNS CNAMEs: $CNAME_COUNT/9" && V_PASS=$((V_PASS + 1)) \
  || (warn "DNS CNAMEs: $CNAME_COUNT/9" && V_FAIL=$((V_FAIL + 1)))

# ═════════════════════════════════════════════════════════
echo ""
echo -e "${B}${G}════════════════════════════════════════════════════════${N}"
if [ "$ERRORS" -eq 0 ] && [ "$V_FAIL" -eq 0 ]; then
  echo -e "${B}${G}  ✅  Setup complete — all checks passed${N}"
else
  echo -e "${B}${Y}  ⚠  Setup complete — review warnings above${N}"
fi
echo -e "${G}════════════════════════════════════════════════════════${N}"
echo ""
echo -e "  ${B}Stats:${N} ${G}$CREATED created${N} | ${C}$SKIPPED skipped (already exist)${N} | ${R}$ERRORS errors${N}"
echo ""
echo -e "  ${B}Resources created:${N}"
echo "    • VPC: $VPC_NAME with subnet $SUBNET_NAME ($SUBNET_RANGE)"
echo "    • Firewall rules: internal + SSH/HTTP"
echo "    • Cloud DNS: $LAB_DOMAIN with 9 CNAME records"
echo "    • 7 secrets in Secret Manager (shared)"
echo "    • 9 service accounts (instructor-sa + team1-sa … team8-sa)"
echo "    • Cloud Build SA — 5 roles"
echo "    • Default Compute SA — 7 roles (incl. run.invoker)"
echo "    • Student group — 3 roles (viewer, build, logs)"
echo "    • Firestore security rules (via REST API)"
echo ""
echo -e "  ${B}Domain mapping (after deploy):${N}"
echo "    instructor → https://instructor.${LAB_DOMAIN}"
echo "    team1      → https://team1.${LAB_DOMAIN}"
echo "    team2      → https://team2.${LAB_DOMAIN}"
echo "    ...        → https://team8.${LAB_DOMAIN}"
echo ""
echo -e "  ${B}VPC Info (show students in Console):${N}"
echo "    Console → VPC Network → VPC Networks → $VPC_NAME"
echo ""
echo -e "  ${B}Deploy (instructor test):${N}"
echo ""
echo "    gcloud builds submit --config cloudbuild-app.yaml \\"
echo "      --substitutions=_TEAM=instructor ."
echo ""
echo -e "  ${B}Each team deploys with:${N}"
echo ""
echo "    gcloud builds submit --config cloudbuild-app.yaml \\"
echo "      --substitutions=_TEAM=teamN ."
echo ""
echo -e "  ${B}Remaining manual steps:${N}"
echo "    1. Firebase Console → Auth → Authorized domains → add *.${LAB_DOMAIN}"
echo "    2. Org policy (if not done):"
echo "       gcloud resource-manager org-policies set-policy /tmp/policy.yaml --project=$PROJECT_ID"
echo "    3. Test full pipeline as instructor"
echo ""