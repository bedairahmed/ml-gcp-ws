# =============================================================================
#  🕌  Madina Lab — Multi-stage Dockerfile
# =============================================================================
#
#  Stage 1: BUILD  → Installs dependencies, compiles React app with Vite
#  Stage 2: SERVE  → Serves static files with nginx on port 8080
#
#  Build args are injected by Cloud Build from Secret Manager.
#  The /health endpoint is used by Cloud Run for startup probes.
#
# =============================================================================

# ── Stage 1: Build the React app ─────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build args for Vite environment variables
# These are injected by Cloud Build from Secret Manager
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_APP_ENV=production
ARG VITE_NAMESPACE
ARG VITE_APP_URL

# Install dependencies
COPY package.json bun.lockb ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# ── Stage 2: Serve with nginx ────────────────────────────
FROM nginx:alpine

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config:
#   - SPA routing (all paths → index.html)
#   - /health endpoint for Cloud Run startup probes
#   - Listens on port 8080 (Cloud Run requirement)
RUN echo 'server { \
    listen 8080; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        return 200 "ok"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]