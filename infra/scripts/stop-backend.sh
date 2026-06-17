#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Service shutdown order (reverse of startup)
SERVICES=(
  "booking-app-notification-service"
  "booking-app-booking-service"
  "booking-app-core-service"
  "booking-app-user-service"
  "booking-app-auth-service"
  "booking-app-api-gateway"
  "booking-app-config-server"
  "booking-app-service-registry"
)

echo -e "${YELLOW}Stopping Booking App Backend Services...${NC}"

for service in "${SERVICES[@]}"; do
  if systemctl is-active --quiet "${service}.service"; then
    echo -e "${YELLOW}Stopping $service...${NC}"
    sudo systemctl stop "${service}.service"
    echo -e "${GREEN}Stopped $service${NC}"
  else
    echo -e "${YELLOW}$service is not running${NC}"
  fi
  sleep 1
done

echo -e "${GREEN}All services stopped.${NC}"
