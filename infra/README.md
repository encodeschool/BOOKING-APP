# 🧠 Your current infra structure

```bash
infra/
 ├── docker/
 ├── kubernetes/
 ├── monitoring/
 ├── nginx/
 ├── scripts/
 └── terraform/
```

You also have:
- 🖥 VDS (Nginx + Java + PostgreSQL)
- 🧩 Spring Boot microservices
- 🚪 API Gateway
- 🚀 BEST APPROACH (for your level)

You have 2 valid options:
- ✅ Option A (recommended now): Docker + GitHub Actions → VPS
Simple, stable, production-ready
- 🔥 Option B (later): Kubernetes on VPS / cloud
More complex, not needed yet

## 👉 I’ll design Option A (best for you right now)
🏗️ FINAL DEPLOYMENT FLOW

```bash
GitHub push
   ↓
GitHub Actions
   ↓
Build Docker images
   ↓
Push to VPS (SSH)
   ↓
docker compose up -d
   ↓
Nginx routes traffic
```

### 🐳 1. Move all services into Docker Compose

Inside:
```bash
infra/docker/docker-compose.yml
```
Example:
```bash
version: "3.8"

services:

  service-registry:
    image: registry:latest
    ports:
      - "8761:8761"

  api-gateway:
    image: api-gateway:latest
    ports:
      - "8080:8080"

  auth-service:
    image: auth-service:latest
    ports:
      - "8081:8081"

  user-service:
    image: user-service:latest
    ports:
      - "8082:8082"

  core-service:
    image: core-service:latest
    ports:
      - "8083:8083"

  booking-service:
    image: booking-service:latest
    ports:
      - "8084:8084"
```

### 🐙 2. GitHub Actions CI/CD

Create:
```bash
.github/workflows/deploy.yml
```


🔥 FULL WORKING PIPELINE
```bash
name: Deploy Microservices

on:
  push:
    branches:
      - main

jobs:
  build-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Build services
        run: |
          mvn clean package -DskipTests

      - name: Build Docker images
        run: |
          docker build -t api-gateway ./api-gateway
          docker build -t auth-service ./auth-service
          docker build -t user-service ./user-service
          docker build -t core-service ./core-service
          docker build -t booking-service ./booking-service

      - name: Save SSH key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

      - name: Deploy to VPS
        run: |
          ssh -o StrictHostKeyChecking=no root@${{ secrets.VPS_IP }} << 'EOF'
            cd /opt/app

            git pull origin main

            docker compose -f infra/docker/docker-compose.yml down
            docker compose -f infra/docker/docker-compose.yml up -d --build
          EOF
```
### 🔐 3. GitHub Secrets you MUST add

Go to:
```bash
👉 GitHub → Settings → Secrets
```
Add:
```bash
VPS_IP = your-server-ip
SSH_KEY = private ssh key
```

### 🖥 4. VPS setup (IMPORTANT)

On your VDS:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
```
Create app folder:
```bash
mkdir -p /opt/app
cd /opt/app
git clone https://github.com/your-repo.git .
```

### 🌐 5. NGINX (your reverse proxy)

Inside:
```bash
infra/nginx/default.conf
```
Example:
```bash
server {
    listen 80;

    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

👉 Nginx sends traffic → API Gateway

### 🧠 6. DATABASE (Postgres on VPS)

Since you already have Postgres:

👉 DO NOT containerize DB yet (good decision)

Just configure:
```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/yourdb
spring.datasource.username=postgres
spring.datasource.password=****
```

### 🔥 7. How everything works now
Developer pushes code:
```bash
git push origin main
```
GitHub Actions:
- builds services
- builds Docker images
- SSH into VPS
- restarts system

VPS:
- runs docker compose
- nginx routes traffic
- services communicate via Eureka
### ⚠️ IMPORTANT FIXES YOU MUST DO
#### 1. DO NOT use localhost inside Docker

❌ wrong:
```bash
localhost:8761
```
✅ correct:
```bash
service-registry:8761
```
#### 2. Use one network

In docker-compose:
```yaml
networks:
  app-network:
```

#### 3. API Gateway is ONLY public entry
```bash
Internet → Nginx → API Gateway → microservices
```

### 🚀 FINAL ARCHITECTURE
```bash
                NGINX (VPS)
                     ↓
             API GATEWAY (Docker)
                     ↓
   ---------------------------------
   | auth | user | core | booking  |
   ---------------------------------
                     ↓
            SERVICE REGISTRY
                     ↓
                POSTGRES (VPS)
```