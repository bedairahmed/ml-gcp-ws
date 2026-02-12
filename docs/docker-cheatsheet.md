# 🐳 Docker — Quick Reference

## Image Management

```bash
# List & search
docker images                          # List local images
docker images --all                    # Include dangling images
docker search nginx                    # Search Docker Hub

# Build
docker build -t NAME .                 # Build image from Dockerfile
docker build -t NAME:TAG .             # Build with custom tag
docker build -t NAME --file Dockerfile.prod .  # Use specific Dockerfile
docker build -t NAME --build-arg ENV=prod .    # Pass build arguments

# Download & Remove
docker pull IMAGE                      # Download image
docker pull IMAGE:TAG                  # Download specific version
docker rmi IMAGE                       # Delete image (fails if container uses it)
docker rmi -f IMAGE                    # Force delete image
docker image prune                     # Remove unused images
docker image prune -a                  # Remove all unused images
```
> **Tag format:** `registry/repository:tag` (e.g., `docker.io/nginx:latest`)

## Container Lifecycle

```bash
# List containers
docker ps                              # Running containers only
docker ps -a                           # All containers (running + stopped)
docker ps -q                           # Container IDs only (useful with xargs)

# Run containers
docker run IMAGE                       # Run with random name
docker run --name my-container IMAGE   # Custom container name
docker run -p 8080:8080 IMAGE          # Port mapping (host:container)
docker run -p 8080:8080/udp IMAGE      # UDP port mapping
docker run -d IMAGE                    # Detached (background) mode
docker run -it IMAGE bash              # Interactive terminal
docker run -e VAR=value IMAGE          # Set environment variable
docker run -v /path/on/host:/path/in/container IMAGE  # Volume mount
docker run --rm IMAGE                  # Auto-remove on exit
docker run --restart=always IMAGE      # Auto-restart on failure

# Control containers
docker stop CONTAINER                  # Graceful shutdown (15 sec timeout)
docker stop -t 30 CONTAINER            # Custom timeout
docker kill CONTAINER                  # Force kill immediately
docker restart CONTAINER               # Restart container
docker pause CONTAINER                 # Pause processes
docker unpause CONTAINER               # Resume processes
docker rm CONTAINER                    # Delete stopped container
docker rm -f CONTAINER                 # Force delete running container
docker rm $(docker ps -q)              # Delete all containers
```
> **Port mapping:** Left = host machine, Right = container. `localhost:8080` → container port `8080`

## Container Inspection & Debugging

```bash
# Logs
docker logs CONTAINER                  # View all logs
docker logs -f CONTAINER               # Follow logs (live)
docker logs --tail=50 CONTAINER        # Last 50 lines
docker logs --timestamps CONTAINER     # Show timestamps

# Inspect
docker inspect CONTAINER               # Detailed container info (JSON)
docker top CONTAINER                   # Running processes
docker stats CONTAINER                 # CPU/memory usage
docker diff CONTAINER                  # Files changed in container
docker exec -it CONTAINER bash         # Shell into running container
docker exec CONTAINER ps aux           # Run command without interactive shell
```

## Docker Compose

```bash
# Setup & Control
docker compose up                      # Start services
docker compose up -d                   # Start in background
docker compose up --build              # Build & start
docker compose down                    # Stop & remove containers
docker compose down -v                 # Also remove volumes (careful!)
docker compose restart                 # Restart all services
docker compose restart SERVICE_NAME    # Restart specific service

# Logs & Debugging
docker compose logs                    # Show all service logs
docker compose logs -f SERVICE_NAME    # Follow logs of specific service
docker compose ps                      # List services
docker compose exec SERVICE_NAME bash  # Shell into service

# Maintenance
docker compose pull                    # Download latest images
docker compose build                   # Rebuild images
docker compose config                  # Validate & print config
```
> **Compose:** Define multi-container apps in `docker-compose.yml`. One command to start everything.

## Dockerfile Instructions

```dockerfile
# Base image (required)
FROM node:20-alpine                  # Use specific version, not 'latest'
FROM --platform=linux/amd64 node:20  # Specify platform

# Metadata
LABEL maintainer="your@email.com"
LABEL description="Application description"

# Working directory
WORKDIR /app                         # All subsequent commands run here

# Copy files
COPY package*.json ./                # From host to container
COPY . .                             # Current directory

# Run command (during build)
RUN npm install                      # Runs once during build
RUN npm install && npm cache clean --force  # Combine to reduce layers

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (documentation only, doesn't publish)
EXPOSE 8080

# Set user (security: don't run as root)
USER nodejs                          # Switch to specific user

# Default command (can be overridden)
CMD ["node", "server.js"]            # Shell form: CMD node server.js
ENTRYPOINT ["node"]                  # Fixed command, args override
CMD ["server.js"]                    # These combine: node server.js

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node healthcheck.js
```
> **Layers:** Each instruction creates a layer. Use `&&` to combine RUN commands and reduce image size.

## Multi-Stage Build (Optimization)

```dockerfile
# Stage 1: Build (large image with build tools)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                           # Clean install (production-ready)
COPY . .
RUN npm run build

# Stage 2: Runtime (minimal image, only what's needed)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**Why multi-stage?**
- Stage 1: Node.js (~200MB) + npm + source code
- Stage 2: nginx only (~25MB) + built files
- **Result:** Final image ~25MB instead of ~500MB ✅

**Copy from stage:** `COPY --from=build /app/dist /usr/share/nginx/html`

## Best Practices & Optimization

```dockerfile
# ✅ GOOD - Specific version
FROM node:20-alpine

# ❌ AVOID - Latest version (unpredictable)
FROM node:latest

# ✅ GOOD - Combine RUN commands
RUN apt-get update && \
    apt-get install -y package && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# ❌ AVOID - Separate commands create extra layers
RUN apt-get update
RUN apt-get install -y package
RUN apt-get clean

# ✅ GOOD - Use .dockerignore
# .dockerignore
node_modules/
.git/
.env

# ✅ GOOD - Don't run as root
USER nodejs

# ✅ GOOD - Use health checks
HEALTHCHECK --interval=30s CMD curl http://localhost:8080/health
```

## Common Docker Commands Reference

```bash
# Cleanup (recover disk space)
docker image prune -a                  # Remove unused images
docker container prune                 # Remove stopped containers
docker volume prune                    # Remove unused volumes
docker system prune -a                 # Remove everything unused

# Image management
docker save IMAGE > image.tar          # Export image to file
docker load < image.tar                # Import image from file
docker tag SOURCE:tag TARGET:tag       # Create alias for image
docker push REGISTRY/IMAGE:tag         # Upload to registry

# Registry login
docker login -u USERNAME               # Login to Docker Hub
docker login REGISTRY_URL              # Login to custom registry
docker logout                          # Logout
```

## Quick Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Port already in use | Port bound twice | Use different port or `docker stop` other container |
| Image not found | Wrong tag or not pulled | `docker pull` or check `docker images` |
| Container stops immediately | Entry point failed | Check logs: `docker logs CONTAINER` |
| Permission denied in volume | User/file permissions | Run with `-u root` or fix host permissions |
| Out of disk space | Too many images/volumes | Run `docker system prune -a` |

## Example Workflow

```bash
# Build
docker build -t myapp:1.0 .

# Run locally
docker run -p 8080:8080 -v $PWD:/app myapp:1.0

# Debug
docker logs -f CONTAINER_ID
docker exec -it CONTAINER_ID bash

# Clean up
docker stop CONTAINER_ID
docker rm CONTAINER_ID
docker rmi myapp:1.0
```