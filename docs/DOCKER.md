# Docker Deployment Guide

Complete guide for building, testing, and deploying the Business Management System using Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Build & Test](#local-build--test)
3. [Docker Hub Deployment](#docker-hub-deployment)
4. [Production Deployment](#production-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Docker Desktop installed ([download](https://www.docker.com/products/docker-desktop))
- Docker Hub account ([create one](https://hub.docker.com/))
- Environment variables configured (`.env.local`)

## Local Build & Test

### 1. Build Docker Image

Build the Docker image locally:

```bash
docker build -t studio-demo:latest \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  --build-arg SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY \
  .
```

**Build Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Service role key for server |
| `NEXT_PUBLIC_API_URL` | Optional | API URL (default: http://localhost:9000) |
| `NEXT_PUBLIC_SITE_URL` | Optional | Site URL (default: http://localhost:9000) |

### 2. Run Container Locally

Test the container locally:

```bash
docker run -p 9000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  -e SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY \
  studio-demo:latest
```

The app will be available at: **http://localhost:9000**

### 3. Using Docker Compose (Development)

For local development with Docker Compose:

```bash
# Create .env.docker file
cat > .env.docker << EOF
NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
EOF

# Start container with docker-compose
docker-compose -f docker-compose.prod.yml --env-file .env.docker up --build
```

The app will be available at: **http://localhost:9000**

**Stop the container:**
```bash
docker-compose -f docker-compose.prod.yml down
```

---

## Docker Hub Deployment

### 1. Login to Docker Hub

```bash
docker login
```

You'll be prompted for your Docker Hub username and password.

### 2. Tag Image for Docker Hub

```bash
docker tag studio-demo:latest USERNAME/studio-demo:latest
docker tag studio-demo:latest USERNAME/studio-demo:v1.0.0
```

Replace `USERNAME` with your Docker Hub username.

### 3. Push to Docker Hub

Push both the latest and version tags:

```bash
docker push USERNAME/studio-demo:latest
docker push USERNAME/studio-demo:v1.0.0
```

### 4. Verify on Docker Hub

Visit your Docker Hub repository to verify the image was pushed:
```
https://hub.docker.com/r/USERNAME/studio-demo
```

---

## Production Deployment

### Option 1: AWS ECS (Recommended for Production)

```bash
# 1. Create ECS cluster
aws ecs create-cluster --cluster-name studio-demo

# 2. Register task definition
aws ecs register-task-definition \
  --family studio-demo \
  --container-definitions file://task-definition.json

# 3. Create service
aws ecs create-service \
  --cluster studio-demo \
  --service-name studio-demo-service \
  --task-definition studio-demo \
  --desired-count 2 \
  --launch-type FARGATE
```

### Option 2: DigitalOcean App Platform

1. Connect Docker Hub account to DigitalOcean
2. Select your `USERNAME/studio-demo` image
3. Configure environment variables
4. Deploy

### Option 3: Self-Hosted (VPS)

```bash
# SSH into your server
ssh user@your-server.com

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Pull and run image
docker pull USERNAME/studio-demo:latest
docker run -d \
  -p 9000:3000 \
  --name studio-demo \
  -e NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  USERNAME/studio-demo:latest

# Setup auto-restart
docker update --restart always studio-demo
```

### Option 4: Using Docker Compose (Production)

```bash
# 1. Create environment file
scp .env.docker user@your-server.com:~/

# 2. Copy docker-compose file
scp docker-compose.prod.yml user@your-server.com:~/

# 3. SSH and start
ssh user@your-server.com

# 4. Start containers
docker-compose -f docker-compose.prod.yml --env-file .env.docker up -d

# 5. View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

---

## Image Specifications

### Base Image
- **Node.js**: 20-Alpine (lightweight, ~150MB)
- **Architecture**: linux/amd64

### Image Size
- **Uncompressed**: ~400-500MB
- **Compressed**: ~100-150MB

### Multi-Stage Build

The Dockerfile uses multi-stage builds for optimization:

```
Stage 1: base          - Node.js Alpine image
Stage 2: deps          - Install dependencies
Stage 3: builder       - Build Next.js app
Stage 4: runner        - Production runtime (final)
```

**Result**: Only production dependencies included, ~60% size reduction.

---

## Health Checks

The Docker setup includes automated health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/auth/me
```

This checks if the app is running and responding.

### Check Container Health

```bash
# View health status
docker ps --filter "name=studio-demo"

# View health logs
docker inspect --format='{{json .State.Health}}' studio-demo | jq
```

---

## Environment Variables

All environment variables must be provided at build time or runtime:

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | No | `eyJhbGciOi...` |
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:9000` |
| `NEXT_PUBLIC_SITE_URL` | No | `http://localhost:9000` |
| `NODE_ENV` | No | `production` |

### Pass Variables to Container

**Via docker run:**
```bash
docker run -e NEXT_PUBLIC_SUPABASE_URL=xxx -e NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx ...
```

**Via .env file:**
```bash
docker run --env-file .env.docker ...
```

**Via docker-compose:**
```yaml
environment:
  NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY: $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Docker Best Practices Applied

✅ **Multi-stage builds** - Reduce final image size  
✅ **Non-root user** - Run as `nodejs` user for security  
✅ **Health checks** - Monitor container health  
✅ **Environment variables** - Flexible configuration  
✅ **Alpine images** - Lightweight base  
✅ **Production build** - Optimized for performance  
✅ **Network isolation** - Docker network for containers  
✅ **Volume management** - Persistent public files  

---

## Troubleshooting

### Build Fails with "NEXT_PUBLIC_SUPABASE_URL not set"

```bash
# Solution: Pass build arguments
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=xxx \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=yyy \
  -t studio-demo:latest .
```

### Container Starts but App Doesn't Respond

```bash
# Check logs
docker logs studio-demo

# View health status
docker inspect --format='{{json .State.Health}}' studio-demo | jq

# Restart container
docker restart studio-demo
```

### "Cannot connect to database" Error

```bash
# Verify environment variables
docker inspect studio-demo | grep NEXT_PUBLIC

# Check if Supabase credentials are correct
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Port Already in Use

```bash
# Use different port
docker run -p 8080:3000 studio-demo:latest

# Or find and stop conflicting container
docker ps
docker stop <container-id>
```

### Image Size Too Large

```bash
# Check image layers
docker history studio-demo:latest

# Rebuild with build cache
docker build --no-cache -t studio-demo:latest .
```

---

## Testing the Docker Image

### 1. Test Locally

```bash
# Build
docker build -t studio-demo:test \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  .

# Run
docker run -p 9000:3000 studio-demo:test

# Test in browser
open http://localhost:9000

# Test login
# Email: demo@example.com
# Password: DemoPassword123
```

### 2. Run Container Tests

```bash
# Check if app is running
docker exec -it studio-demo curl http://localhost:3000/api/auth/me

# Check logs
docker logs studio-demo

# Check health
docker ps --filter "name=studio-demo"
```

---

## CI/CD Integration

### GitHub Actions (Example)

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]

jobs:
  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: docker/build-push-action@v4
        with:
          push: true
          tags: |
            ${{ secrets.DOCKERHUB_USERNAME }}/studio-demo:latest
            ${{ secrets.DOCKERHUB_USERNAME }}/studio-demo:${{ github.ref_name }}
          build-args: |
            NEXT_PUBLIC_SUPABASE_URL=${{ secrets.SUPABASE_URL }}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.SUPABASE_ANON_KEY }}
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment/docker)
- [Docker Hub Registry](https://hub.docker.com/)

---

**For questions or issues, open a GitHub issue or check the [CONTRIBUTING.md](../CONTRIBUTING.md).**
