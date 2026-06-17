# Enroll App - Customization Reference

All deployment files have been customized for your specific VDS setup.

## Configuration Applied

- **VDS Home Directory:** `/home/encode/enroll/`
- **Linux User:** `encode`
- **API Domain:** `api-enroll.encode.uz`
- **Admin Domain:** `admin-enroll.encode.uz`
- **Web Domain:** `enroll.encode.uz`
- **Service Ports:** 9761, 9888, 9081-9085, 9087

## Files Created

### 1. Systemd Service Units (`infra/systemd/`)
- booking-app-service-registry.service
- booking-app-config-server.service
- booking-app-api-gateway.service
- booking-app-auth-service.service
- booking-app-user-service.service
- booking-app-core-service.service
- booking-app-booking-service.service
- booking-app-notification-service.service

**Customization:** All paths use `/home/encode/enroll/jars/`, user is `encode`

### 2. Backend Scripts (`infra/scripts/`)
- start-backend.sh - Starts all services in order
- stop-backend.sh - Graceful shutdown
- status-backend.sh - Check health and ports
- deploy-backend.sh - Deployment helper

**Customization:** All paths reference `/home/encode/enroll/`

### 3. Nginx Configuration (`infra/nginx/`)
- nginx-jar.conf - Reverse proxy + static file serving

**Customization:** 
- Domains: `api-enroll.encode.uz`, `admin-enroll.encode.uz`, `enroll.encode.uz`
- Paths: `/home/encode/enroll/{admin,web}/`
- Logs: `/home/encode/enroll/logs/nginx_*.log`

### 4. CI/CD Workflows (`.github/workflows/`)
- ci-backend.yml - Build backend on services/ changes
- ci-admin.yml - Build admin on apps/admin/ changes
- ci-web.yml - Build web on apps/web/ changes
- deploy-backend.yml - Deploy to /home/encode/enroll/jars/
- deploy-admin.yml - Deploy to /home/encode/enroll/admin/
- deploy-web.yml - Deploy to /home/encode/enroll/web/
- ci.yml - Unified CI for PR verification

**Customization:** All workflows use `/home/encode/enroll/` and `encode` user

### 5. Port Configuration Updates (`services/`)
- All service application.yml files updated (ports 8xxx → 9xxx)
- Config server config files updated with new Eureka port (9761)

### 6. Documentation
- infra/ENROLL-VDS-SETUP.md - Quick setup for your config
- infra/README-JAR-DEPLOYMENT.md - Full deployment guide
- infra/VDS-QUICK-START.md - Quick reference
- DEPLOYMENT-MIGRATION-SUMMARY.md - Migration overview
- CUSTOMIZATION-REFERENCE.md - This file

## Key File Locations

**Local Machine:**
```
booking-app/
├── infra/systemd/                 (8 service files)
├── infra/scripts/                 (4 scripts)
├── infra/nginx/nginx-jar.conf
├── infra/ENROLL-VDS-SETUP.md      ← YOUR SETUP GUIDE
├── .github/workflows/             (7 workflow files)
└── services/*/src/main/resources/ (Updated configs)
```

**VDS Server:**
```
/home/encode/enroll/
├── jars/        (JAR files)
├── logs/        (Service & Nginx logs)
├── scripts/     (Management scripts)
├── admin/       (Admin frontend)
├── web/         (Web frontend)
└── backup/      (Auto backups)

/etc/systemd/system/booking-app-*.service (8 files)
/etc/nginx/sites-available/enroll
/etc/letsencrypt/live/{your-domains}/
```

## Quick Start

1. **SSH to VDS:**
   ```bash
   mkdir -p /home/encode/enroll/{jars,logs,scripts,admin,web,backup}
   ```

2. **Copy systemd files:**
   ```bash
   sudo cp infra/systemd/*.service /etc/systemd/system/
   sudo systemctl daemon-reload
   ```

3. **Copy scripts:**
   ```bash
   cp infra/scripts/*.sh /home/encode/enroll/scripts/
   chmod +x /home/encode/enroll/scripts/*.sh
   ```

4. **Setup SSL:**
   ```bash
   sudo certbot certonly --standalone \
     -d api-enroll.encode.uz \
     -d admin-enroll.encode.uz \
     -d enroll.encode.uz
   ```

5. **Configure Nginx:**
   ```bash
   sudo cp infra/nginx/nginx-jar.conf /etc/nginx/sites-available/enroll
   sudo ln -s /etc/nginx/sites-available/enroll /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl restart nginx
   ```

6. **Add GitHub secrets:**
   - SSH_KEY
   - VDS_IP
   - VDS_USERNAME=encode

7. **Deploy:**
   ```bash
   git push origin main
   ```

## Service Management

```bash
# Start all services
sudo /home/encode/enroll/scripts/start-backend.sh

# Stop all services
sudo /home/encode/enroll/scripts/stop-backend.sh

# Check status
sudo /home/encode/enroll/scripts/status-backend.sh

# View logs
sudo journalctl -u "booking-app-*" -f
```

## Port Reference

**Internal (localhost only):**
- 9761 - Service Registry
- 9888 - Config Server
- 9081-9085, 9087 - Services

**Public (via Nginx HTTPS):**
- api-enroll.encode.uz → API Gateway (9087)
- admin-enroll.encode.uz → Static files
- enroll.encode.uz → Static files

## Documentation Guide

| Document | Purpose |
|----------|---------|
| infra/ENROLL-VDS-SETUP.md | Quick setup for your configuration |
| infra/README-JAR-DEPLOYMENT.md | Complete deployment guide with all options |
| infra/VDS-QUICK-START.md | Quick reference for common tasks |
| DEPLOYMENT-MIGRATION-SUMMARY.md | Overview of migration from Docker to JAR |
| CUSTOMIZATION-REFERENCE.md | This file - reference for customizations |

## All Changes Summary

✅ 8 Systemd service files configured for your paths and user
✅ 4 Backend management scripts updated with your paths
✅ 1 Nginx configuration with your domains
✅ 6 CI/CD workflows configured for your setup
✅ All service ports updated (8xxx → 9xxx)
✅ 5 Documentation files with your configuration

Everything is ready for deployment!
