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
```

---

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

