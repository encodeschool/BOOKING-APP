# VDS Deployment - Quick Start Guide

## What Changed

This migration moves from Docker-based deployment to direct JAR execution with systemd management.

**Old Setup:**
- Docker containers for all services
- docker-compose orchestration
- Ports: 8761, 8888, 8081-8087, etc.

**New Setup:**
- JAR files with systemd services
- Direct JVM process management
- Ports: 9761, 9888, 9081-9087, etc. (shifted to 9xxx range)
- Nginx reverse proxy for frontends and API gateway

## Directory Structure

```
/var/services/
  jars/                 # All JAR files
  logs/                 # Service logs
  scripts/              # Management scripts
    start-backend.sh
    stop-backend.sh
    status-backend.sh
    deploy-backend.sh

/var/www/
  admin/               # Admin frontend static files
  web/                 # Web frontend static files

/etc/systemd/system/
  booking-app-*.service   # 8 service unit files

/etc/nginx/
  sites-available/booking-app
  sites-enabled/booking-app
```

## Initial Setup (First Time Only)

Run these commands on VDS:

```bash
# 1. Create user
sudo useradd -r -s /bin/bash booking

# 2. Create directories
sudo mkdir -p /var/services/jars /var/services/logs /var/services/scripts
sudo mkdir -p /var/www/admin /var/www/web

# 3. Set permissions
sudo chown -R booking:booking /var/services /var/www

# 4. Copy files from your repo (or CI/CD will do this)
sudo cp infra/systemd/*.service /etc/systemd/system/
sudo cp infra/scripts/*.sh /var/services/scripts/
sudo chmod +x /var/services/scripts/*.sh

# 5. Reload systemd
sudo systemctl daemon-reload

# 6. Enable services on boot (optional)
sudo systemctl enable booking-app-service-registry
sudo systemctl enable booking-app-config-server
# ... etc for all services
```

## Deployment Methods

### Automatic (GitHub Actions) - Recommended

Push to `main` branch → CI/CD automatically deploys:

```bash
git push origin main
# Watch deployment in: https://github.com/your-org/booking-app/actions
```

### Manual - Backend Only

```bash
# 1. Build JARs locally
mvn -f services/pom.xml clean package -DskipTests

# 2. Deploy to VDS
ssh user@vds-ip "mkdir -p /tmp/backend-deploy"
rsync -az services/*/target/*.jar user@vds-ip:/tmp/backend-deploy/

# 3. On VDS, deploy and start
ssh user@vds-ip << 'EOF'
  sudo cp /tmp/backend-deploy/*.jar /var/services/jars/
  sudo chown -R booking:booking /var/services
  sudo /var/services/scripts/stop-backend.sh 2>/dev/null || true
  sudo /var/services/scripts/start-backend.sh
EOF
```

### Manual - Frontend

```bash
# Admin
npm ci --legacy-peer-deps && npm run build --prefix apps/admin
rsync -az --delete apps/admin/dist/ user@vds-ip:/var/www/admin/

# Web
npm ci --legacy-peer-deps && npm run build --prefix apps/web
rsync -az --delete apps/web/dist/ user@vds-ip:/var/www/web/

# Reload Nginx
ssh user@vds-ip "sudo systemctl reload nginx"
```

## Service Management

### Status of All Services

```bash
sudo /var/services/scripts/status-backend.sh
```

### View Logs

```bash
# Real-time API Gateway logs
sudo journalctl -u booking-app-api-gateway -f

# Last 50 lines of all services
sudo journalctl -u "booking-app-*" -n 50
```

### Restart Services

```bash
# Restart one
sudo systemctl restart booking-app-api-gateway

# Restart all
sudo /var/services/scripts/stop-backend.sh
sudo /var/services/scripts/start-backend.sh
```

## Port Mapping

| Service | Port | Public? |
|---------|------|---------|
| Service Registry | 9761 | No (internal) |
| Config Server | 9888 | No (internal) |
| API Gateway | 9087 | Via Nginx SSL |
| Auth Service | 9081 | No |
| User Service | 9082 | No |
| Core Service | 9083 | No |
| Booking Service | 9084 | No |
| Notification Service | 9085 | No |

**Public access via Nginx:**
- https://api.example.com → 9087
- https://admin.example.com → /var/www/admin (static)
- https://booking.example.com → /var/www/web (static)

## GitHub Actions Setup

1. **Add these secrets to repo settings:**
   - `SSH_KEY`: Your VDS private SSH key
   - `VDS_IP`: VDS IP address
   - `VDS_USERNAME`: SSH username

2. **Workflows automatically trigger:**
   - `ci-backend.yml`: On services/ changes
   - `ci-admin.yml`: On apps/admin/ changes
   - `ci-web.yml`: On apps/web/ changes
   - `deploy-backend.yml`: On push to main + services/ changes
   - `deploy-admin.yml`: On push to main + apps/admin/ changes
   - `deploy-web.yml`: On push to main + apps/web/ changes
   - `ci.yml`: On any push/PR (builds everything)

## Troubleshooting

**Services not starting?**
```bash
sudo journalctl -u booking-app-api-gateway -n 50
# Look for: Port already in use, Database unreachable, Config server not responding
```

**Database connection failed?**
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -h localhost -U postgres -d auth_db
```

**Nginx not routing traffic?**
```bash
# Test Nginx config
sudo nginx -t

# Test backend availability
curl http://localhost:9087/actuator/health
```

**Ports in use?**
```bash
sudo lsof -i :9087
# Kill process if needed: sudo kill -9 <PID>
```

## Rollback

If deployment breaks things:

```bash
# Restore from backup
sudo cp /var/services/backup/<timestamp>/*.jar /var/services/jars/

# Restart services
sudo /var/services/scripts/stop-backend.sh
sudo /var/services/scripts/start-backend.sh
```

## Monitoring

Set up monitoring for:

1. **Port listening:** `curl http://localhost:9087/actuator/health`
2. **Service registry:** `curl http://localhost:9761/eureka/apps`
3. **Logs:** `sudo journalctl -u "booking-app-*" -f`
4. **System resources:** `htop`, `df -h /var/services`

## Nginx SSL Setup

```bash
# Install certificate
sudo certbot certonly --webroot -d api.example.com

# Install Nginx config
sudo cp infra/nginx/nginx-jar.conf /etc/nginx/sites-available/booking-app
sudo ln -s /etc/nginx/sites-available/booking-app /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx

# Auto-renewal
sudo certbot renew --dry-run
```

## Next Steps

1. **First time setup:** Run initial setup commands above
2. **Test manually:** Build and deploy one service
3. **Configure CI/CD:** Add GitHub secrets
4. **Monitor:** Check logs and service status regularly
5. **Set up SSL:** Configure Nginx with Let's Encrypt

## Support Documents

- Full guide: `infra/README-JAR-DEPLOYMENT.md`
- Service configs: `services/config-server/src/main/resources/config/`
- Nginx config: `infra/nginx/nginx-jar.conf`
- Systemd templates: `infra/systemd/`
- Scripts: `infra/scripts/`
