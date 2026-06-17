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
```

---

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
