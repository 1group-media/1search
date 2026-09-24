#!/usr/bin/env bash
set -e

PROJECT_ID="onepay-prod-1group"
SERVICE_NAME="onesearch-prod"
REGION="us-central1"

echo "🚀 Deploying 1search to Production Fleet ($PROJECT_ID / $SERVICE_NAME)..."

gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV="production",APP_ENV="production",NEXT_PUBLIC_APP_ENV="production",DATABASE_URL="postgresql://postgres.aswefqrejqbhujjybgex:520372e54bba9d399fca752c0deb97f7@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

echo "✅ Production deployment complete for 1search: https://search.1group.media"
