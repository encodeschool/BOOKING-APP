#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
JAR_DIR="${JAR_DIR:-/home/encode/enroll/jars}"
LOG_DIR="${LOG_DIR:-/home/encode/enroll/logs}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Service startup order with dependencies
SERVICES=(
  "booking-app-service-registry"
  "booking-app-config-server"
  "booking-app-api-gateway"
  "booking-app-auth-service"
  "booking-app-user-service"
  "booking-app-core-service"
  "booking-app-booking-service"
  "booking-app-notification-service"
)

echo -e "${YELLOW}Starting Booking App Backend Services...${NC}"

# Create directories if they don't exist
mkdir -p "$JAR_DIR" "$LOG_DIR"

# Check if all required JARs exist (handle versioned names like service-registry-0.0.1-SNAPSHOT.jar)
echo -e "${YELLOW}Checking for required JAR files...${NC}"
for service in "${SERVICES[@]}"; do
  service_name=$(echo "$service" | sed 's/booking-app-//' | sed 's/-service$//')

  # Find JAR file (handle versioned names)
  jar_file=$(find "$JAR_DIR" -maxdepth 1 -name "${service_name}*.jar" 2>/dev/null | head -1)

  if [ -z "$jar_file" ]; then
    echo -e "${RED}ERROR: JAR file not found for: $service_name${NC}"
    echo -e "${RED}Searched in: $JAR_DIR/${service_name}*.jar${NC}"
    echo -e "${YELLOW}Available JARs:${NC}"
    ls -1 "$JAR_DIR"/*.jar 2>/dev/null || echo "  (no JARs found)"
    exit 1
  fi
  echo -e "${GREEN}✓ Found: $(basename $jar_file)${NC}"
done

echo -e "${GREEN}All JAR files found.${NC}"

# Start services using systemctl
for service in "${SERVICES[@]}"; do
  echo -e "${YELLOW}Starting $service...${NC}"

  # Enable the service on boot
  sudo systemctl enable "${service}.service" 2>/dev/null || true

  # Start or restart the service
  if systemctl is-active --quiet "${service}.service"; then
    sudo systemctl restart "${service}.service"
    echo -e "${GREEN}Restarted $service${NC}"
  else
    sudo systemctl start "${service}.service"
    echo -e "${GREEN}Started $service${NC}"
  fi

  # Wait for service to stabilize (except for the last one)
  sleep 3
done

# Wait additional time for all services to be ready
echo -e "${YELLOW}Waiting for all services to stabilize...${NC}"
sleep 5

# Check service status
echo -e "${YELLOW}Checking service status...${NC}"
all_running=true
for service in "${SERVICES[@]}"; do
  if systemctl is-active --quiet "${service}.service"; then
    echo -e "${GREEN}✓ $service is running${NC}"
  else
    echo -e "${RED}✗ $service is NOT running${NC}"
    all_running=false
  fi
done

if [ "$all_running" = true ]; then
  echo -e "${GREEN}All services started successfully!${NC}"
  echo ""
  echo "Services are running on the following ports:"
  echo "  Service Registry (Eureka): http://localhost:9761"
  echo "  Config Server:            http://localhost:9888"
  echo "  API Gateway:              https://api-enroll.encode.uz"
  echo "  Auth Service:             http://localhost:9081"
  echo "  User Service:             http://localhost:9082"
  echo "  Core Service:             http://localhost:9083"
  echo "  Booking Service:          http://localhost:9084"
  echo "  Notification Service:     http://localhost:9085"
  echo ""
  echo "Frontend access:"
  echo "  Admin:                    https://admin-enroll.encode.uz"
  echo "  Web:                      https://enroll.encode.uz"
  exit 0
else
  echo -e "${RED}Some services failed to start. Check logs with: journalctl -u <service-name> -f${NC}"
  exit 1
fi
