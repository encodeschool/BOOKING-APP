# Booking App - Deployment Architecture Migration Summary

## Completed Changes

### 1. Port Configuration Updates ✅

All services updated to use 9xxx port range to avoid conflicts with existing VDS ports (3000, 5471, 8080-8087).

**Files Modified:**
- `services/service-registry/src/main/resources/application.yml` (8761 → 9761)
- `services/config-server/src/main/resources/application.yml` (8888 → 9888)
- `services/api-gateway/src/main/resources/application.yml` (8087 → 9087)
- `services/*/src/main/resources/application.yml` (updated config-server URLs)
- `services/config-server/src/main/resources/config/*.yml` (all service ports updated)

**Port Mapping:**
- Service Registry (Eureka): 8761 → 9761
- Config Server: 8888 → 9888
- API Gateway: 8087 → 9087
- Auth Service: 8081 → 9081
- User Service: 8082 → 9082
- Core Service: 8083 → 9083
- Booking Service: 8084 → 9084
- Notification Service: 8085 → 9085

### 2. Systemd Service Units ✅

Created systemd unit files for production-grade service management with auto-restart capabilities.

**Files Created in `infra/systemd/`:**
- `booking-app-service-registry.service`
- `booking-app-config-server.service`
- `booking-app-api-gateway.service`
- `booking-app-auth-service.service`
- `booking-app-user-service.service`
- `booking-app-core-service.service`
- `booking-app-booking-service.service`
- `booking-app-notification-service.service`

**Features:**
- Automatic restart on failure
- Proper service dependencies (startup order)
- Configurable JVM heap sizes
- Systemd journal logging
- Auto-enable on boot

### 3. Backend Management Scripts ✅

Created shell scripts for service lifecycle management.

**Files Created in `infra/scripts/`:**
- `start-backend.sh` - Start all services in correct order
- `stop-backend.sh` - Graceful shutdown in reverse order
- `status-backend.sh` - Check all services status and ports
- `deploy-backend.sh` - Deployment helper script

**Features:**
- Service startup ordering (config-server first, then others)
- Health checks and port verification
- Color-coded output for easy reading
- Error handling and validation

### 4. Separate CI/CD Workflows ✅

Replaced monolithic Docker-based deployment with separate workflows for each component.

**Files Created in `.github/workflows/`:**
- `ci-backend.yml` - Build backend JARs (triggers on services/ changes)
- `ci-admin.yml` - Build admin frontend (triggers on apps/admin/ changes)
- `ci-web.yml` - Build web frontend (triggers on apps/web/ changes)
- `deploy-backend.yml` - Deploy backend to VDS (main branch only)
- `deploy-admin.yml` - Deploy admin frontend (main branch only)
- `deploy-web.yml` - Deploy web frontend (main branch only)
- `ci.yml` - Unified CI for all components (PR verification)

**Features:**
- Independent build and deploy pipelines
- Path-based triggers (only build affected components)
- Artifact caching for faster builds
- SSH-based secure deployment
- Automatic service restart on VDS

**Removed/Replaced:**
- Old `deploy.yml` (replaced with three separate deploy workflows)

### 5. Nginx Reverse Proxy Configuration ✅

Created production-ready Nginx configuration for routing and static file serving.

**Files Created:**
- `infra/nginx/nginx-jar.conf` - Nginx configuration template

**Features:**
- SSL/HTTPS with Let's Encrypt support
- Reverse proxy to API Gateway (port 9087)
- Static file serving for admin and web frontends
- SPA routing support (try_files for React/Vue apps)
- Caching headers for static assets
- WebSocket support for real-time features
- CORS and security headers

### 6. Documentation ✅

Created comprehensive deployment guides.

**Files Created:**
- `infra/README-JAR-DEPLOYMENT.md` - Full deployment guide (500+ lines)
- `infra/VDS-QUICK-START.md` - Quick reference guide
- `DEPLOYMENT-MIGRATION-SUMMARY.md` - This file

## Deployment Strategy

### Traditional (Removed)
```
Old: GitHub Actions → Docker Build → rsync → docker-compose up
Problems: Slower builds, resource-intensive, harder to manage individual services
```

### New: JAR-Based with systemd
```
New: GitHub Actions → Maven Build → rsync JAR + systemd files → systemctl start
Benefits: Faster, lighter, better process management, easier debugging
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Actions                          │
│                                                               │
│  ├─ ci-backend.yml → Build Services → Upload JARs            │
│  ├─ ci-admin.yml  → Build Admin    → Upload dist/            │
│  ├─ ci-web.yml    → Build Web      → Upload dist/            │
│  │                                                             │
│  └─ deploy-backend/admin/web.yml → Deploy to VDS on main    │
└─────────────────────────────────────────────────────────────┘
                              ↓ rsync
┌─────────────────────────────────────────────────────────────┐
│                         VDS Server                           │
│                                                               │
│  /var/services/jars/          /etc/systemd/system/           │
│  ├─ service-registry.jar      ├─ booking-app-*.service (8)   │
│  ├─ config-server.jar         └─ Auto-restart on failure    │
│  ├─ api-gateway.jar                                          │
│  ├─ auth-service.jar          /var/services/scripts/        │
│  ├─ user-service.jar          ├─ start-backend.sh           │
│  ├─ core-service.jar          ├─ stop-backend.sh            │
│  ├─ booking-service.jar       ├─ status-backend.sh          │
│  └─ notification-service.jar  └─ deploy-backend.sh          │
│                                                               │
│  /var/www/                    /etc/nginx/                    │
│  ├─ admin/ (static)           └─ sites-available/           │
│  └─ web/ (static)                 └─ booking-app (SSL)      │
│                                                               │
│  Services (systemd) → JVM Processes (9081-9088)             │
│  ├─ Service Registry (9761)                                  │
│  ├─ Config Server (9888)                                     │
│  ├─ API Gateway (9087) ← Main entry point                   │
│  ├─ Auth Service (9081)                                      │
│  ├─ User Service (9082)                                      │
│  ├─ Core Service (9083)                                      │
│  ├─ Booking Service (9084)                                   │
│  └─ Notification Service (9085)                             │
│                                                               │
│  ┌─ Nginx (Reverse Proxy + SSL) ─────────────────────┐      │
│  │  https://api.example.com → localhost:9087         │      │
│  │  https://admin.example.com → /var/www/admin       │      │
│  │  https://booking.example.com → /var/www/web       │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Deployment

### Admin & Web Frontends
- **Build Output:** `dist/` directory (static HTML/JS/CSS)
- **Deployment:** Direct file sync to `/var/www/admin` and `/var/www/web`
- **Serving:** Nginx serves static files + reverse proxies /api calls to API Gateway
- **Benefits:** No Node.js runtime needed on VDS, instant file serving

## Service Startup Order

Systemd dependencies ensure correct startup order:

1. **Tier 1:** Service Registry (no dependencies)
2. **Tier 2:** Config Server (depends on Service Registry)
3. **Tier 3:** API Gateway (depends on both above)
4. **Tier 4:** Data-dependent services (Auth, User, Core)
5. **Tier 5:** Dependent services (Booking depends on Core)
6. **Tier 6:** Notification Service (independent)

## GitHub Actions Secrets Required

Add these to your GitHub repository settings:

```
SSH_KEY        - Private SSH key for VDS access
VDS_IP         - VDS server IP address
VDS_USERNAME   - SSH username on VDS
```

## First-Time VDS Setup

1. Create booking user: `sudo useradd -r booking`
2. Create directories: `sudo mkdir -p /var/services/jars /var/www/{admin,web}`
3. Set permissions: `sudo chown -R booking:booking /var/services /var/www`
4. Install Java: `sudo apt-get install openjdk-17-jre-headless`
5. Install Nginx: `sudo apt-get install nginx certbot`
6. Deploy systemd files: Copy from `infra/systemd/`
7. Reload systemd: `sudo systemctl daemon-reload`

## Local Development

Run services locally without Docker:

```bash
# Build JARs
mvn clean package -DskipTests

# Start all services (requires Linux/WSL with systemd)
./infra/scripts/start-backend.sh

# Check status
./infra/scripts/status-backend.sh

# View logs
journalctl -u booking-app-api-gateway -f
```

## Key Benefits

✅ **Faster Builds** - No Docker image building, just Maven
✅ **Lighter Deployments** - Only JARs + systemd files, not full containers
✅ **Better Debuggability** - Direct systemd logs, no container wrapper
✅ **Easier Monitoring** - Standard systemd tools and commands
✅ **Auto-Restart** - systemd handles failures automatically
✅ **Resource Efficient** - JVM processes, not full Docker daemon
✅ **Separation of Concerns** - Each app deployed independently
✅ **Production Ready** - Industry-standard systemd approach

## Migration Checklist

- [x] Update all service ports (8xxx → 9xxx)
- [x] Create systemd unit files
- [x] Create management scripts
- [x] Separate CI/CD workflows
- [x] Create Nginx configuration
- [x] Write deployment documentation
- [ ] Test locally (next step)
- [ ] Configure GitHub Actions secrets (next step)
- [ ] Deploy to VDS (next step)
- [ ] Monitor and validate (next step)

## Testing Steps

1. **Local:** `./infra/scripts/start-backend.sh` (Linux/WSL)
2. **CI/CD:** Push to develop branch, check workflow runs
3. **VDS:** Deploy to staging environment first
4. **Smoke Tests:** Verify all endpoints respond correctly
5. **Database:** Confirm all connections working
6. **SSL:** Set up Let's Encrypt certificates

## Rollback Plan

If something goes wrong:

```bash
# Stop services
sudo /var/services/scripts/stop-backend.sh

# Restore from backup
sudo cp /var/services/backup/<timestamp>/*.jar /var/services/jars/

# Restart
sudo /var/services/scripts/start-backend.sh
```

## Support & Troubleshooting

Refer to:
- `infra/README-JAR-DEPLOYMENT.md` - Comprehensive guide
- `infra/VDS-QUICK-START.md` - Quick reference
- `infra/scripts/` - Script source code with comments
- Service logs: `sudo journalctl -u <service> -f`

---

**Migration Completed:** June 7, 2026
**Architecture:** Microservices with Eureka Service Discovery + Nginx reverse proxy
**Deployment Tool:** GitHub Actions with separate workflows
**Service Management:** systemd with auto-restart
