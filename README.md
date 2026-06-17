<<<<<<< HEAD
Assuming:

```
enroll/
├── services/
│   ├── config-server/
│   ├── service-registry/
│   ├── api-gateway/
│   ├── user-service/
│   ├── auth-service/
│   ├── core-service/
│   ├── booking-service/
│   ├── notification-service/
│   └── common-security/
├── apps/
│   ├── admin/
│   └── web/
```

and `common-security` is a shared library (not a Spring Boot application), here is a complete GitHub Actions workflow that:

* Builds all Maven projects
* Builds React applications
* Uploads everything to the VPS
* Restarts the services in the correct order using systemd

### `.github/workflows/deploy.yml`

```yaml
name: Deploy Microservices

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Cache Maven Repository
        uses: actions/cache@v4
        with:
          path: ~/.m2/repository
          key: ${{ runner.os }}-maven-${{ hashFiles('services/pom.xml', 'services/**/pom.xml') }}
          restore-keys: |
            ${{ runner.os }}-maven-

      - name: Build Backend Services
        working-directory: services
        run: mvn clean package -DskipTests

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Build Admin Frontend
        working-directory: apps/admin
        run: |
          npm ci --legacy-peer-deps
          npm run build

      - name: Build Web Frontend
        working-directory: apps/web
        run: |
          npm ci --legacy-peer-deps
          npm run build

      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

      - name: Deploy Project Files
        run: |
          rsync -az --delete \
            --exclude='.git' \
            --exclude='node_modules' \
            -e "ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa" \
            ./ \
            ${{ secrets.VPS_USERNAME }}@${{ secrets.VPS_IP }}:/home/${{ secrets.VPS_USERNAME }}/enroll

      - name: Restart Services
        run: |
          ssh -o StrictHostKeyChecking=no \
              -i ~/.ssh/id_rsa \
              ${{ secrets.VPS_USERNAME }}@${{ secrets.VPS_IP }} << EOF

          sudo systemctl restart config-server
          sleep 15

          sudo systemctl restart service-registry
          sleep 15

          sudo systemctl restart api-gateway
          sleep 10

          sudo systemctl restart user-service
          sleep 5

          sudo systemctl restart auth-service
          sleep 5

          sudo systemctl restart core-service
          sleep 5

          sudo systemctl restart booking-service
          sleep 5

          sudo systemctl restart notification-service
          sleep 5

          sudo systemctl status config-server --no-pager
          sudo systemctl status service-registry --no-pager
          sudo systemctl status api-gateway --no-pager

          EOF
=======
# BOOKING-APP

## Overview

This repository contains a Spring Boot microservice ecosystem with frontend apps and Docker deployment support.

The architecture includes:
- `services/` Spring Boot services:
  - `service-registry`
  - `config-server`
  - `api-gateway`
  - `auth-service`
  - `user-service`
  - `core-service`
  - `booking-service`
  - `notification-service`
- `apps/` clients:
  - `web/` public web frontend
  - `admin/` admin frontend
  - `mobile/` Flutter mobile app
- `infra/docker/docker-compose.yml` for local/container deployment

## Port mapping

The current local Docker Compose mapping is:
- `9001` → `service-registry` (8761)
- `9002` → `config-server` (8888)
- `9003` → `api-gateway` (8087)
- `9004` → `auth-service` (8081)
- `9005` → `user-service` (8082)
- `9006` → `core-service` (8083)
- `9007` → `booking-service` (8084)
- `9008` → `notification-service` (8085)
- `9009` → `admin-frontend` (80)
- `9010` → `web-frontend` (80)

> Note: `api-gateway` now uses port `8087` internally, and all frontend/dev URLs should point to the gateway at `http://localhost:8087`.

---

## Prerequisites

1. Install Docker and Docker Compose.
2. Install Java 17+ and Maven if you want to run services directly.
3. Install Flutter if you want to build/run the mobile app.
4. Clone the repository and open the root folder.

---

## Local build and run (backend services)

If you want to run services without Docker, you can start them from each service folder.

### Recommended order

1. Start `service-registry`
2. Start `config-server`
3. Start `api-gateway`
4. Start each application service

### Example commands

From the service folder:

```bash
cd services/service-registry
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

```bash
cd services/config-server
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

```bash
cd services/api-gateway
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

```bash
cd services/auth-service
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Repeat for `user-service`, `core-service`, `booking-service`, and `notification-service`.

### Build only

To compile a service without running it:

```bash
cd services/<service-name>
./mvnw clean package -DskipTests
```

Example:

```bash
cd services/core-service
./mvnw clean package -DskipTests
>>>>>>> 542f503507b2fbd890d22f6a6de620ab6278dd96
```

---

<<<<<<< HEAD
## VPS systemd services

### `/etc/systemd/system/config-server.service`

```ini
[Unit]
Description=Config Server
After=network.target

[Service]
User=enroll
WorkingDirectory=/home/enroll/enroll
ExecStart=/usr/bin/java -jar /home/enroll/enroll/services/config-server/target/config-server.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### `/etc/systemd/system/service-registry.service`

```ini
[Unit]
Description=Service Registry
After=config-server.service
Requires=config-server.service

[Service]
User=enroll
WorkingDirectory=/home/enroll/enroll
ExecStart=/usr/bin/java -jar /home/enroll/enroll/services/service-registry/target/service-registry.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### `/etc/systemd/system/api-gateway.service`

```ini
[Unit]
Description=API Gateway
After=service-registry.service
Requires=service-registry.service

[Service]
User=enroll
WorkingDirectory=/home/enroll/enroll
ExecStart=/usr/bin/java -jar /home/enroll/enroll/services/api-gateway/target/api-gateway.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### `/etc/systemd/system/user-service.service`

```ini
[Unit]
Description=User Service
After=service-registry.service
Requires=service-registry.service

[Service]
User=enroll
WorkingDirectory=/home/enroll/enroll
ExecStart=/usr/bin/java -jar /home/enroll/enroll/services/user-service/target/user-service.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### `/etc/systemd/system/auth-service.service`

```ini
[Unit]
Description=Auth Service
After=service-registry.service
Requires=service-registry.service

[Service]
User=enroll
WorkingDirectory=/home/enroll/enroll
ExecStart=/usr/bin/java -jar /home/enroll/enroll/services/auth-service/target/auth-service.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### `/etc/systemd/system/core-service.service`

```ini
[Unit]
Description=Core Service
After=service-registry.service
Requires=service-registry.service

[Service]
User=enroll
WorkingDirectory=/home/enroll/enroll
ExecStart=/usr/bin/java -jar /home/enroll/enroll/services/core-service/target/core-service.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### `/etc/systemd/system/booking-service.service`

```ini
[Unit]
Description=Booking Service
After=service-registry.service
Requires=service-registry.service

[Service]
User=enroll
WorkingDirectory=/home/enroll/enroll
ExecStart=/usr/bin/java -jar /home/enroll/enroll/services/booking-service/target/booking-service.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### `/etc/systemd/system/notification-service.service`

```ini
[Unit]
Description=Notification Service
After=service-registry.service
Requires=service-registry.service

[Service]
User=enroll
WorkingDirectory=/home/enroll/enroll
ExecStart=/usr/bin/java -jar /home/enroll/enroll/services/notification-service/target/notification-service.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable everything once on the VPS:

```bash
sudo systemctl daemon-reload

sudo systemctl enable config-server
sudo systemctl enable service-registry
sudo systemctl enable api-gateway
sudo systemctl enable user-service
sudo systemctl enable auth-service
sudo systemctl enable core-service
sudo systemctl enable booking-service
sudo systemctl enable notification-service
```

Start them:

```bash
sudo systemctl start config-server
sudo systemctl start service-registry
sudo systemctl start api-gateway
sudo systemctl start user-service
sudo systemctl start auth-service
sudo systemctl start core-service
sudo systemctl start booking-service
sudo systemctl start notification-service
```

Check logs:

```bash
journalctl -u config-server -f
journalctl -u service-registry -f
journalctl -u api-gateway -f
journalctl -u user-service -f
```

This gives you a Docker-free deployment with GitHub Actions + Spring Boot JARs + systemd service management.
=======
## Docker deployment

This is the fastest way to run the full system locally.

### Start all containers

From the repository root:

```bash
docker compose -f infra/docker/docker-compose.yml up -d --build
```

This command:
- builds each service image
- starts the containers
- keeps them running in detached mode

### Stop all containers

```bash
docker compose -f infra/docker/docker-compose.yml down
```

### Restart containers

```bash
docker compose -f infra/docker/docker-compose.yml restart
```

### Rebuild one service only

To rebuild and restart a single service:

```bash
docker compose -f infra/docker/docker-compose.yml up -d --build <service-name>
```

Example:

```bash
docker compose -f infra/docker/docker-compose.yml up -d --build api-gateway
```

### View logs

Follow logs for all containers:

```bash
docker compose -f infra/docker/docker-compose.yml logs -f
```

Follow logs for a single container:

```bash
docker compose -f infra/docker/docker-compose.yml logs -f api-gateway
```

### Remove stopped containers and rebuild clean

```bash
docker compose -f infra/docker/docker-compose.yml down
docker compose -f infra/docker/docker-compose.yml up -d --build
```

---

## Frontend local development

### Web and admin apps

The web and admin frontends use Vite proxies configured to point to `http://localhost:8087`.

To run them locally in development mode:

```bash
cd apps/web
npm install
npm run dev
```

```bash
cd apps/admin
npm install
npm run dev
```

### Mobile app

The mobile app is configured to use the local API gateway port `8087` for emulator and device development.

To run the Flutter app:

```bash
cd apps/mobile
flutter pub get
flutter run
```

---

## Common workflows

### Full rebuild and restart

```bash
docker compose -f infra/docker/docker-compose.yml down
docker compose -f infra/docker/docker-compose.yml up -d --build
```

### Only rebuild backend services

```bash
docker compose -f infra/docker/docker-compose.yml up -d --build service-registry config-server api-gateway auth-service user-service core-service booking-service notification-service
```

### Only rebuild frontends

```bash
docker compose -f infra/docker/docker-compose.yml up -d --build admin-frontend web-frontend
```

---

## Troubleshooting

### Port conflict on `8080`

If a service fails because `8080` is already in use, check running processes:

```bash
lsof -i :8080
```

Then stop or kill the conflicting process.

### Confirm gateway port

`api-gateway` is configured to listen internally on `8087`.
If you are testing from a browser or another client, use:

```bash
http://localhost:8087
```

### Restart after config changes

After changing service config or code, rebuild and restart the Docker Compose stack:

```bash
docker compose -f infra/docker/docker-compose.yml up -d --build
```

### Check container health and logs

If a container fails immediately, inspect its logs:

```bash
docker compose -f infra/docker/docker-compose.yml logs -f <service-name>
```

---

## Notes

- The `services/Dockerfile` is used by all Spring Boot services.
- The microservices are registered by Eureka via `service-registry`.
- The `config-server` reads config and is required before `api-gateway` and other services start.
- The `api-gateway` proxies incoming API traffic and must use the current gateway port.

---

## Quick commands

```bash
# Start everything
docker compose -f infra/docker/docker-compose.yml up -d --build

# Stop everything
docker compose -f infra/docker/docker-compose.yml down

# Restart everything
docker compose -f infra/docker/docker-compose.yml restart

# View logs
docker compose -f infra/docker/docker-compose.yml logs -f
```


If you need safe cleanup
If you want to preserve current containers but remove stopped/unused data:
```bash
sudo docker container prune
sudo docker image prune -af
sudo docker volume prune
sudo docker network prune
```

Important
This is a host disk/daemon issue, not a code issue. Freeing space on the Docker host will resolve this build failure.

>>>>>>> 542f503507b2fbd890d22f6a6de620ab6278dd96
