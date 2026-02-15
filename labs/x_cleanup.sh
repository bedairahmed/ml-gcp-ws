#!/bin/bash

PROJECT="ml-gcp-workshop-487117"
REGION="us-central1"
KEEP_SERVICE="madina-lab-instructor"

echo "Setting project..."
gcloud config set project $PROJECT

echo "Fetching Cloud Run services..."
SERVICES=$(gcloud run services list \
  --region $REGION \
  --format="value(metadata.name)")

for SERVICE in $SERVICES; do
  if [[ "$SERVICE" != "$KEEP_SERVICE" ]]; then
    echo "Deleting $SERVICE..."
    gcloud run services delete $SERVICE \
      --region $REGION \
      --quiet
  else
    echo "Keeping $SERVICE"
  fi
done

echo "Cleanup complete."
