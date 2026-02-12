# 🐳 Docker — Quick Reference

## Images

```bash
docker images                          # List local images
docker build -t NAME .                 # Build image from Dockerfile
docker build -t NAME:TAG .             # Build with tag
docker pull IMAGE                      # Download image
docker rmi IMAGE                       # Remove image
```

## Containers

```bash
docker ps                              # Running containers
docker ps -a                           # All containers (including stopped)
docker run -p 8080:8080 IMAGE          # Run with port mapping
docker run -d IMAGE                    # Run in background
docker stop CONTAINER                  # Stop container
docker rm CONTAINER                    # Remove container
docker logs CONTAINER                  # View logs
docker exec -it CONTAINER bash         # Shell into container
```

## Docker Compose

```bash
docker compose up --build              # Build and start
docker compose up -d                   # Start in background
docker compose down                    # Stop and remove
docker compose logs -f                 # Follow logs
docker compose ps                      # List services
```

## Dockerfile Key Instructions

```dockerfile
FROM node:20-alpine          # Base image
WORKDIR /app                 # Set working directory
COPY . .                     # Copy files into image
RUN npm install              # Run command during build
EXPOSE 8080                  # Document the port
CMD ["node", "server.js"]    # Command to run on start
```

## Multi-Stage Build (Our Dockerfile)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
```

**Why multi-stage?** Stage 1 has Node.js + source code (large). Stage 2 only has nginx + built files (small). Final image is ~25MB instead of ~500MB.