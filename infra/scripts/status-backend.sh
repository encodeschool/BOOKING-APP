#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SERVICES=(
  "booking-app-service-registry:9761"
  "booking-app-config-server:9888"
  "booking-app-api-gateway:9087"
  "booking-app-auth-service:9081"
  "booking-app-user-service:9082"
  "booking-app-core-service:9083"
  "booking-app-booking-service:9084"
  "booking-app-notification-service:9085"
)

echo -e "${YELLOW}=== Booking App Backend Status ===${NC}"
echo ""

all_running=true
for service_info in "${SERVICES[@]}"; do
  service="${service_info%%:*}"
  port="${service_info##*:}"

  if systemctl is-active --quiet "${service}.service"; then
    status="${GREEN}✓ RUNNING${NC}"
    # Check if port is actually listening
    if lsof -Pi ":${port}" -sTCP:LISTEN -t >/dev/null 2>&1; then
      port_status="${GREEN}(port $port listening)${NC}"
    else
      port_status="${RED}(port $port NOT listening)${NC}"
      all_running=false
    fi
  else
    status="${RED}✗ STOPPED${NC}"
    port_status=""
    all_running=false
  fi

  printf "%-40s %b %b\n" "$service:" "$status" "$port_status"
done

echo ""
echo -e "${YELLOW}Systemd service logs can be viewed with:${NC}"
echo "  journalctl -u <service-name> -f"
echo "  journalctl -u booking-app-api-gateway -f"
echo ""

if [ "$all_running" = true ]; then
  echo -e "${GREEN}All services are running and healthy!${NC}"
  exit 0
else
  echo -e "${RED}Some services are not running or ports are not listening.${NC}"
  exit 1
fi
