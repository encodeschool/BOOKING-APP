# Enroll App - VDS Deployment Setup

## Your Configuration

- **VDS Path:** `/home/encode/enroll/`
- **User:** `encode`
- **Domains:**
  - **API:** https://api-enroll.encode.uz (API Gateway on port 9087)
  - **Admin:** https://admin-enroll.encode.uz (Static files)
  - **Web:** https://enroll.encode.uz (Static files)

## Directory Structure on VDS

```
/home/encode/enroll/
├── jars/                      # JAR files for all services
│   ├── service-registry.jar
│   ├── config-server.jar
│   ├── api-gateway.jar
│   ├── auth-service.jar
│   ├── user-service.jar
│   ├── core-service.jar
│   ├── booking-service.jar
│   └── notification-service.jar
├── logs/                      # Service and Nginx logs
│   ├── nginx_api_access.log
│   ├── nginx_admin_access.log
│   ├── nginx_web_access.log
│   └── [service logs via journalctl]
├── scripts/                   # Management scripts
│   ├── start-backend.sh
│   ├── stop-backend.sh
│   ├── status-backend.sh
│   └── deploy-backend.sh
├── admin/                     # Admin frontend (static files)
│   └── dist/* (build output)
├── web/                       # Web frontend (static files)
│   └── dist/* (build output)
└── backup/                    # JAR backups (auto-created)
    └── YYYYMMDD_HHMMSS/
```

## Initial Setup (One-Time)

SSH to VDS and run:

```bash
# 1. Create directories
mkdir -p /home/encode/enroll/{jars,logs,scripts,admin,web,backup}

# 2. Copy systemd files from git repo
sudo cp /path/to/repo/infra/systemd/*.service /etc/systemd/system/

# 3. Copy scripts and make executable
cp /path/to/repo/infra/scripts/*.sh /home/encode/enroll/scripts/
chmod +x /home/encode/enroll/scripts/*.sh

# 4. Set permissions
sudo chown -R encode:encode /home/encode/enroll

# 5. Reload systemd
sudo systemctl daemon-reload

# 6. Install Nginx
sudo apt-get install nginx certbot python3-certbot-nginx

# 7. Configure SSL certificates
sudo certbot certonly --standalone \
  -d api-enroll.encode.uz \
  -d admin-enroll.encode.uz \
  -d enroll.encode.uz

# 8. Configure Nginx
sudo cp /path/to/repo/infra/nginx/nginx-jar.conf /etc/nginx/sites-available/enroll
sudo ln -s /etc/nginx/sites-available/enroll /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default 2>/dev/null || true
sudo nginx -t
sudo systemctl restart nginx
```

## Service Management

### Start All Services

```bash
sudo /home/encode/enroll/scripts/start-backend.sh
```

### Stop All Services

```bash
sudo /home/encode/enroll/scripts/stop-backend.sh
```

### Check Status

```bash
sudo /home/encode/enroll/scripts/status-backend.sh
```

### View Logs

```bash
# Real-time logs for API Gateway
sudo journalctl -u booking-app-api-gateway -f

# All service logs
sudo journalctl -u "booking-app-*" -f

# Last 50 lines
sudo journalctl -u "booking-app-*" -n 50
```

### Service ports (internal)

```
9761 - Service Registry (Eureka)
9888 - Config Server
9087 - API Gateway (reverse proxied via Nginx)
9081 - Auth Service (internal)
9082 - User Service (internal)
9083 - Core Service (internal)
9084 - Booking Service (internal)
9085 - Notification Service (internal)
```

## GitHub Actions Deployment

1. **Add secrets to GitHub repository:**
   - `SSH_KEY` - VDS SSH private key
   - `VDS_IP` - VDS server IP
   - `VDS_USERNAME` - SSH username (encode)

2. **Deploy by pushing to main:**
   ```bash
   git push origin main
   ```

3. **Check workflows:**
   - Backend: https://github.com/YOUR-ORG/booking-app/actions/workflows/deploy-backend.yml
   - Admin: https://github.com/YOUR-ORG/booking-app/actions/workflows/deploy-admin.yml
   - Web: https://github.com/YOUR-ORG/booking-app/actions/workflows/deploy-web.yml

## Manual Deployment

### Deploy Backend

```bash
# 1. Build
mvn -f services/pom.xml clean package -DskipTests

# 2. Copy to VDS
ssh encode@YOUR_VDS_IP "mkdir -p /tmp/backend-deploy"
rsync -az services/*/target/*.jar encode@YOUR_VDS_IP:/tmp/backend-deploy/

# 3. Deploy on VDS
ssh encode@YOUR_VDS_IP << 'EOF'
  sudo cp /tmp/backend-deploy/*.jar /home/encode/enroll/jars/
  sudo chown encode:encode /home/encode/enroll/jars/*.jar
  sudo /home/encode/enroll/scripts/stop-backend.sh 2>/dev/null || true
  sudo /home/encode/enroll/scripts/start-backend.sh
EOF
```

### Deploy Admin Frontend

```bash
# Build and deploy
npm ci --legacy-peer-deps --prefix apps/admin
npm run build --prefix apps/admin

rsync -az --delete apps/admin/dist/ encode@YOUR_VDS_IP:/home/encode/enroll/admin/
ssh encode@YOUR_VDS_IP "sudo systemctl reload nginx"
```

### Deploy Web Frontend

```bash
# Build and deploy
npm ci --legacy-peer-deps --prefix apps/web
npm run build --prefix apps/web

rsync -az --delete apps/web/dist/ encode@YOUR_VDS_IP:/home/encode/enroll/web/
ssh encode@YOUR_VDS_IP "sudo systemctl reload nginx"
```

## Testing

### API Gateway
```bash
curl https://api-enroll.encode.uz/actuator/health
```

### Admin Frontend
```bash
curl https://admin-enroll.encode.uz/
```

### Web Frontend
```bash
curl https://enroll.encode.uz/
```

### Service Registry
```bash
curl http://localhost:9761/eureka/apps  # From VDS only
```

## Nginx Configuration

**File:** `/etc/nginx/sites-available/enroll`

```bash
# View current config
sudo cat /etc/nginx/sites-available/enroll

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# View access logs
sudo tail -f /home/encode/enroll/logs/nginx_api_access.log
sudo tail -f /home/encode/enroll/logs/nginx_admin_access.log
sudo tail -f /home/encode/enroll/logs/nginx_web_access.log

# View error logs
sudo tail -f /home/encode/enroll/logs/nginx_api_error.log
```

## SSL Certificate Renewal

```bash
# Manual renewal
sudo certbot renew

# Check auto-renewal status
sudo systemctl status certbot.timer

# Test renewal (dry-run)
sudo certbot renew --dry-run
```

## Troubleshooting

### Services not starting

```bash
# Check systemd logs
sudo journalctl -u booking-app-api-gateway -n 50

# Check if ports are in use
sudo lsof -i -P -n | grep LISTEN | grep 990

# Try restarting specific service
sudo systemctl restart booking-app-api-gateway
```

### Nginx not routing traffic

```bash
# Check if Nginx is running
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Check backend is accessible
curl http://localhost:9087/actuator/health

# Check Nginx error logs
sudo tail -f /home/encode/enroll/logs/nginx_api_error.log
```

### Database connection issues

```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U postgres -d auth_db

# Check service logs for DB errors
sudo journalctl -u booking-app-auth-service -n 100
```

## Backup and Restore

### Backup JARs

```bash
sudo /home/encode/enroll/scripts/stop-backend.sh
sudo tar -czf /home/encode/enroll/backup/jars_$(date +%Y%m%d_%H%M%S).tar.gz /home/encode/enroll/jars/
```

### Restore from Backup

```bash
sudo /home/encode/enroll/scripts/stop-backend.sh
sudo cp /home/encode/enroll/backup/TIMESTAMP/*.jar /home/encode/enroll/jars/
sudo chown encode:encode /home/encode/enroll/jars/*.jar
sudo /home/encode/enroll/scripts/start-backend.sh
```

## Important Notes

- All systemd services run as user `encode`
- Services auto-restart on failure
- Logs available via `journalctl` and Nginx access logs
- Backups created automatically on each deployment
- SSL certificates auto-renew via `certbot` timer
- Nginx reverse proxy handles all external traffic
- All domains must resolve to your VDS IP

## Support Documents

- Full guide: `infra/README-JAR-DEPLOYMENT.md`
- Nginx config template: `infra/nginx/nginx-jar.conf`
- Systemd templates: `infra/systemd/`
- Management scripts: `infra/scripts/`
