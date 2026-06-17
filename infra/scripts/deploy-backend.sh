#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

JAR_DIR="${JAR_DIR:-/home/encode/enroll/jars}"
BACKUP_DIR="${JAR_DIR}/backup"
SYSTEMD_DIR="/etc/systemd/system"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENROLL_USER="encode"

echo -e "${YELLOW}=== Booking App Backend Deployment ===${NC}"

# Check if running as root (required for systemd operations)
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}ERROR: This script must be run as root (use sudo)${NC}"
  exit 1
fi

# Check if JAR files are present in current directory
if [ ! -z "$1" ] && [ -d "$1" ]; then
  SOURCE_DIR="$1"
  echo -e "${YELLOW}Using source directory: $SOURCE_DIR${NC}"
else
  SOURCE_DIR="."
  echo -e "${YELLOW}Using current directory for JAR files${NC}"
fi

# Create necessary directories
echo -e "${YELLOW}Setting up directories...${NC}"
mkdir -p "$JAR_DIR" "$BACKUP_DIR" "$SYSTEMD_DIR"

# Backup existing JAR files
if [ -z "$(ls -A $JAR_DIR/*.jar 2>/dev/null)" ]; then
  echo -e "${YELLOW}No existing JAR files to backup${NC}"
else
  echo -e "${YELLOW}Backing up existing JARs...${NC}"
  mkdir -p "$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)"
  cp "$JAR_DIR"/*.jar "$BACKUP_DIR/$(date +%Y%m%d_%H%M%S)/" 2>/dev/null || true
  echo -e "${GREEN}Backup created${NC}"
fi

# Copy JAR files
echo -e "${YELLOW}Deploying JAR files...${NC}"
SERVICES=(
  "service-registry"
  "config-server"
  "api-gateway"
  "auth-service"
  "user-service"
  "core-service"
  "booking-service"
  "notification-service"
)

for service in "${SERVICES[@]}"; do
  # Build jar name
  jar_file="$SOURCE_DIR/${service}-*.jar"

  # Find the jar file
  found_jar=$(ls $jar_file 2>/dev/null | head -1)
  if [ -n "$found_jar" ]; then
    echo -e "  ${YELLOW}Copying ${service}...${NC}"
    cp "$found_jar" "$JAR_DIR/${service}.jar"
    echo -e "  ${GREEN}✓ ${service}.jar${NC}"
  else
    echo -e "  ${YELLOW}Skipping ${service} (not found)${NC}"
  fi
done

# Copy systemd unit files
echo -e "${YELLOW}Installing systemd unit files...${NC}"
if [ -f "$SCRIPT_DIR/../systemd/booking-app-*.service" ]; then
  cp "$SCRIPT_DIR/../systemd/booking-app-*.service" "$SYSTEMD_DIR/"
  systemctl daemon-reload
  echo -e "${GREEN}Systemd units installed and reloaded${NC}"
else
  echo -e "${RED}WARNING: Systemd unit files not found in $SCRIPT_DIR/../systemd/${NC}"
fi

# Change ownership to encode user
echo -e "${YELLOW}Setting file permissions...${NC}"
chown -R $ENROLL_USER:$ENROLL_USER "$JAR_DIR" 2>/dev/null || echo "  (user may need manual permission fix)"

echo ""
echo -e "${GREEN}Deployment complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Start backend: /home/encode/enroll/scripts/start-backend.sh"
echo "  2. Check status:  /home/encode/enroll/scripts/status-backend.sh"
echo ""
