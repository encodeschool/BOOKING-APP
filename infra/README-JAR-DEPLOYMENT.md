# Booking App - Deployment Guide

## Overview

This guide covers the JAR-based deployment of the Booking App microservices on a VDS (Virtual Dedicated Server) using systemd for service management.

**Architecture:**
- Backend: Java microservices running as systemd units
- Frontend: Static files served by Nginx with reverse proxy to API Gateway
- Service Discovery: Eureka Registry (port 9761)
- Configuration: Centralized Config Server (port 9888)
- API Entry Point: API Gateway (port 9087)

## New Port Assignments

The services run on ports 9xxx to avoid conflicts with existing VDS services:

| Service | Port | Type |
|---------|------|------|
| Service Registry (Eureka) | 9761 | Infrastructure |
| Config Server | 9888 | Infrastructure |
| API Gateway | 9087 | Backend |
| Auth Service | 9081 | Backend |
| User Service | 9082 | Backend |
| Core Service | 9083 | Backend |
| Booking Service | 9084 | Backend |
| Notification Service | 9085 | Backend |
| Admin Frontend | 9009 | Frontend (via Nginx SSL) |
| Web Frontend | 9010 | Frontend (via Nginx SSL) |

## Prerequisites on VDS

1. **Java Runtime** (JDK 17 or higher)
   ```bash
   sudo apt-get update
   sudo apt-get install openjdk-17-jre-headless
   ```

2. **PostgreSQL Database** (already configured, assumed running)
   ```bash
   # Ensure database user and credentials match application config
   ```

3. **Nginx** (for reverse proxy and SSL)
   ```bash
   sudo apt-get install nginx certbot python3-certbot-nginx
   ```

4. **User Account**
   ```bash
   sudo useradd -r -s /bin/bash booking
   ```

5. **Directory Structure**
   ```bash
   sudo mkdir -p /var/services/jars
   sudo mkdir -p /var/services/logs
   sudo mkdir -p /var/www/admin
   sudo mkdir -p /var/www/web
   sudo chown -R booking:booking /var/services
   sudo chown -R booking:booking /var/www
   ```

## Deployment Process

### 1. From GitHub Actions (Automated)

The CI/CD workflows automatically handle deployment on push to `main` branch:

- **Backend Changes**: `deploy-backend.yml` triggers
  - Builds all service JARs
  - Transfers JARs via rsync
  - Deploys systemd units
  - Starts all services

- **Admin Frontend Changes**: `deploy-admin.yml` triggers
  - Builds admin static files
  - Syncs to `/var/www/admin`
  - Nginx serves updated files

- **Web Frontend Changes**: `deploy-web.yml` triggers
  - Builds web static files
  - Syncs to `/var/www/web`
  - Nginx serves updated files

### 2. Manual Deployment

#### Deploy Backend Services

```bash
# On your local machine:
cd /path/to/booking-app

# 1. Build all services
mvn -f services/pom.xml clean package -DskipTests

# 2. SSH to VDS and prepare
ssh user@vds-ip
mkdir -p /tmp/backend-deploy

# 3. From local machine, copy JARs
rsync -az services/*/target/*.jar user@vds-ip:/tmp/backend-deploy/

# 4. On VDS, run deployment
ssh user@vds-ip << 'EOF'
  sudo /var/services/deploy-backend.sh /tmp/backend-deploy
  sudo /var/services/scripts/start-backend.sh
EOF
```

#### Deploy Frontend

```bash
# On local machine:
cd /path/to/booking-app

# 1. Build frontend
npm ci --legacy-peer-deps
npm run build

# 2. Deploy admin
rsync -az --delete apps/admin/dist/ user@vds-ip:/var/www/admin/

# 3. Deploy web
rsync -az --delete apps/web/dist/ user@vds-ip:/var/www/web/

# 4. Reload Nginx
ssh user@vds-ip "sudo systemctl reload nginx"
```

## Service Management

All scripts require `sudo` or direct systemd commands.

### Start All Services

```bash
# Using provided script
sudo /var/services/scripts/start-backend.sh

# Or with systemctl
sudo systemctl start booking-app-service-registry
sudo systemctl start booking-app-config-server
sudo systemctl start booking-app-api-gateway
sudo systemctl start booking-app-auth-service
sudo systemctl start booking-app-user-service
sudo systemctl start booking-app-core-service
sudo systemctl start booking-app-booking-service
sudo systemctl start booking-app-notification-service
```

### Stop All Services

```bash
# Using provided script
sudo /var/services/scripts/stop-backend.sh

# Or with systemctl
sudo systemctl stop booking-app-notification-service
sudo systemctl stop booking-app-booking-service
# ... etc in reverse order
```

### Check Service Status

```bash
# Using provided script
sudo /var/services/scripts/status-backend.sh

# Or with systemctl
sudo systemctl status booking-app-api-gateway
sudo systemctl status booking-app-auth-service
# ... check each service
```

### View Logs

```bash
# Real-time logs for specific service
sudo journalctl -u booking-app-api-gateway -f

# Last 100 lines
sudo journalctl -u booking-app-api-gateway -n 100

# Logs since last boot
sudo journalctl -u booking-app-api-gateway -b

# Follow all booking app services
sudo journalctl -u "booking-app-*" -f
```

### Restart Individual Service

```bash
sudo systemctl restart booking-app-api-gateway
```

## Nginx Configuration

### Setup SSL with Let's Encrypt

```bash
sudo certbot certonly --standalone \
  -d api.example.com \
  -d admin.example.com \
  -d booking.example.com

# Or with webroot (if Nginx already running):
sudo certbot certonly --webroot \
  -w /var/www/html \
  -d api.example.com \
  -d admin.example.com \
  -d booking.example.com
```

### Install Nginx Configuration

```bash
# Copy Nginx config
sudo cp infra/nginx/nginx-jar.conf /etc/nginx/sites-available/booking-app

# Enable site (create symlink)
sudo ln -s /etc/nginx/sites-available/booking-app /etc/nginx/sites-enabled/

# Disable default
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Auto-Renew SSL Certificates

```bash
# Check renewal status
sudo certbot renew --dry-run

# Renew now if needed
sudo certbot renew

# Set up auto-renewal timer
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Monitoring & Health Checks

### API Gateway Health

```bash
curl http://localhost:9087/actuator/health
```

### Service Discovery Status

```bash
curl http://localhost:9761/eureka/apps
```

### Database Connectivity

Each service logs database connection status. Check with:

```bash
sudo journalctl -u booking-app-user-service -n 50
```

### System Resources

```bash
# Check Java process memory usage
ps aux | grep java

# Check port usage
sudo lsof -i -P -n | grep LISTEN

# Check disk usage
df -h /var/services
```

## Troubleshooting

### Services Won't Start

1. **Check Java is installed:**
   ```bash
   java -version
   ```

2. **Check JARs exist and are readable:**
   ```bash
   ls -la /var/services/jars/
   ```

3. **Check systemd errors:**
   ```bash
   sudo journalctl -u booking-app-api-gateway -n 50
   ```

4. **Check port conflicts:**
   ```bash
   sudo lsof -i :9087  # Check if port is already in use
   ```

### Database Connection Issues

1. **Verify PostgreSQL is running:**
   ```bash
   sudo systemctl status postgresql
   ```

2. **Check connection string:**
   ```bash
   # Config is in: services/config-server/src/main/resources/config/
   grep "jdbc:" services/config-server/src/main/resources/config/*.yml
   ```

3. **Test connection:**
   ```bash
   psql -h localhost -U postgres -d auth_db
   ```

### Services Keep Restarting

1. **Check logs for errors:**
   ```bash
   sudo journalctl -u booking-app-api-gateway -f
   ```

2. **Common issues:**
   - Port already in use
   - Database not accessible
   - Config server not ready
   - Eureka registry not responding

3. **Fix and restart:**
   ```bash
   sudo systemctl stop booking-app-api-gateway
   # ... fix issue ...
   sudo systemctl start booking-app-api-gateway
   ```

### Nginx Not Routing Traffic

1. **Check Nginx is running:**
   ```bash
   sudo systemctl status nginx
   ```

2. **Check configuration:**
   ```bash
   sudo nginx -t
   ```

3. **Check backend is accessible:**
   ```bash
   curl http://localhost:9087/api/auth/health
   ```

4. **Check Nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   sudo tail -f /var/log/nginx/access.log
   ```

## Environment Variables

Services use these environment variables (set in systemd unit files):

- `JAR_FILE`: Path to JAR file
- `JAVA_OPTS`: JVM options (heap size, GC settings)
- `EUREKA_DEFAULT_ZONE`: Eureka server URL
- `POSTGRES_HOST`: Database hostname
- `CONFIG_SERVER_PORT`: Config server port (9888)

### Custom Java Options

Edit systemd unit files to adjust:

```ini
Environment="JAVA_OPTS=-Xmx1g -Xms512m -XX:+UseG1GC"
```

Then reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart booking-app-api-gateway
```

## Backup and Recovery

### Backup JARs

```bash
sudo mkdir -p /var/services/backup
sudo tar -czf /var/services/backup/jars-$(date +%Y%m%d_%H%M%S).tar.gz /var/services/jars/
```

### Backup Logs

```bash
sudo tar -czf /var/services/backup/logs-$(date +%Y%m%d_%H%M%S).tar.gz /var/services/logs/
```

### Backup Database

```bash
sudo -u postgres pg_dump auth_db | gzip > /var/services/backup/auth_db-$(date +%Y%m%d_%H%M%S).sql.gz
```

## Local Development

### Run Services Locally

```bash
# 1. Build all services
mvn -f services/pom.xml clean package -DskipTests

# 2. Start services (requires systemd - Linux/WSL only)
./infra/scripts/start-backend.sh

# 3. Check status
./infra/scripts/status-backend.sh

# 4. View logs
journalctl -u booking-app-api-gateway -f
```

### Build and Run Individual Service

```bash
# Build
mvn -f services/auth-service/pom.xml clean package -DskipTests

# Run
java -Xmx512m -Xms256m -jar services/auth-service/target/auth-service-*.jar
```

## Performance Tuning

### Increase Java Heap Size

For production, adjust `JAVA_OPTS` in systemd units:

```bash
# For high-traffic services (API Gateway, Auth)
Environment="JAVA_OPTS=-Xmx1g -Xms512m -XX:+UseG1GC"

# For light services
Environment="JAVA_OPTS=-Xmx256m -Xms128m"
```

### Database Connection Pooling

Configured in service YAMLs via Config Server. Adjust if experiencing connection issues.

### Nginx Caching

Enable caching for static assets in Nginx config to reduce load.

## Security Considerations

1. **Use HTTPS:** Always configure SSL with Let's Encrypt
2. **Restrict SSH:** Use key-based auth, limit SSH access
3. **Firewall:** Only expose ports 80, 443, and SSH (22)
4. **Database:** Use strong passwords, restrict access
5. **Service User:** Run services as non-root `booking` user
6. **Logs:** Monitor logs for suspicious activity

## CI/CD Pipeline

GitHub Actions automates deployment on push to main:

1. Code is pushed to main branch
2. Appropriate workflow triggers (backend, admin, or web)
3. Code is built and tested
4. Artifacts are deployed to VDS via rsync
5. Services are updated and restarted

Required GitHub Secrets:
- `SSH_KEY`: Private SSH key for VDS access
- `VDS_IP`: VDS IP address
- `VDS_USERNAME`: SSH username

## Useful Commands Reference

```bash
# Status and logs
sudo systemctl status booking-app-api-gateway
sudo journalctl -u booking-app-api-gateway -f
sudo /var/services/scripts/status-backend.sh

# Start/stop/restart
sudo systemctl start booking-app-api-gateway
sudo systemctl stop booking-app-api-gateway
sudo systemctl restart booking-app-api-gateway
sudo /var/services/scripts/start-backend.sh
sudo /var/services/scripts/stop-backend.sh

# Check ports
sudo lsof -i -P -n | grep LISTEN
netstat -tulpn | grep LISTEN

# Test API
curl http://localhost:9087/actuator/health
curl https://api.example.com/api/auth/health

# View Nginx config
sudo nginx -T
sudo tail -f /var/log/nginx/access.log

# Check disk usage
du -sh /var/services/*
du -sh /var/www/*
```

## Support

For issues or questions:
1. Check logs: `sudo journalctl -u <service-name> -f`
2. Review Nginx errors: `sudo tail -f /var/log/nginx/error.log`
3. Check database connection: `psql -h localhost -U postgres -l`
4. Test API: `curl http://localhost:9087/api/...`
