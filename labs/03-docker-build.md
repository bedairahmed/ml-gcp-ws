# Lab 03: Docker Build

⏱️ **Duration:** 20 minutes  
📋 **Objective:** Build a Docker container image and run the app in a container locally.

---

## 🎯 Learning Outcomes

- [ ] Understand multi-stage Docker builds
- [ ] Build a production Docker image
- [ ] Run the containerized app locally
- [ ] Understand the difference between dev server and production build

---

## Step 1: Review the Dockerfile

Open and read through the Dockerfile:

```bash
code Dockerfile
```

This is a **multi-stage build** with two stages:

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| **builder** | `node:20-alpine` | Install deps, build React app |
| **production** | `nginx:alpine` | Serve static files |

```
Stage 1 (builder)          Stage 2 (production)
┌─────────────────┐       ┌─────────────────┐
│ npm install      │       │ nginx:alpine    │
│ npm run build    │──────▶│ Copy /dist only │
│ Output: /dist    │       │ Serve on :8080  │
└─────────────────┘       └─────────────────┘
     ~500MB                     ~25MB
```

> 💡 **Why multi-stage?** The final image only contains the built static files + nginx. No Node.js, no `node_modules`, no source code. Result: **~25MB** instead of ~500MB.

---

## Step 2: Build with Docker Compose

The easiest way — uses your `.env` file automatically:

```bash
docker compose up --build
```

Watch the build output:
1. **Stage 1:** Installing dependencies, building React app
2. **Stage 2:** Copying built files to nginx

Once complete, visit **http://localhost:8080** 🎉

> Press `Ctrl+C` to stop.

---

## Step 3: Build Manually (Understanding Build Args)

For deeper understanding, build manually with explicit args:

```bash
# Build the image
docker build \
  --build-arg VITE_FIREBASE_API_KEY=your-key \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com \
  --build-arg VITE_FIREBASE_PROJECT_ID=your-project-id \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=123456789 \
  --build-arg VITE_FIREBASE_APP_ID=1:123456789:web:abcdef \
  --build-arg VITE_NAMESPACE=yourname \
  -t madina-lab:local .
```

```bash
# Run the container
docker run -p 8080:8080 madina-lab:local
```

Visit **http://localhost:8080**

---

## Step 4: Inspect the Image

```bash
# List images — note the size difference
docker images | grep madina-lab

# Expected output:
# madina-lab   local   abc123   25MB
```

> 💡 Compare this to a single-stage build which would be ~500MB!

---

## Step 5: Explore Inside the Container

```bash
# Start a shell inside the running container
docker run -it madina-lab:local sh

# Inside the container:
ls /usr/share/nginx/html/
# You'll see: index.html, assets/, etc.

# Check nginx config
cat /etc/nginx/conf.d/default.conf
# Note the SPA routing: try_files $uri $uri/ /index.html
# Note the /health endpoint

exit
```

---

## Step 6: Test the Health Endpoint

```bash
# With container running:
curl http://localhost:8080/health
# Expected: ok
```

> 💡 Cloud Run uses this endpoint to verify the container is healthy.

---

## Key Concepts

| Concept | What It Means |
|---------|---------------|
| **Multi-stage build** | Multiple `FROM` instructions; only the final stage becomes the image |
| **Build args** | Variables passed at build time (`--build-arg`); baked into the image |
| **SPA routing** | nginx `try_files` sends all routes to `index.html` (React Router handles them) |
| **Health endpoint** | A simple URL that returns `200 OK` — used by orchestrators to check if the app is alive |

---

## ✅ Checkpoint

Before moving on, confirm:

- [ ] Docker image built successfully
- [ ] App running in container at http://localhost:8080
- [ ] Health endpoint returns "ok"
- [ ] You understand multi-stage builds
- [ ] You understand why build args are needed for Vite

---

## 🔗 Next Lab

➡️ [Lab 04: GCP Setup](./04-gcp-setup.md)
