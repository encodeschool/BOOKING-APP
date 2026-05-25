# Docker Deployment

This folder contains the Compose definition for the React frontends and Spring Boot microservices.

## Deployment folder

On your VDS, place the repository under `/home/encode/enroll` so the GitHub Actions deploy workflow can use that path.

## Start services

From the repository root:

```bash
cd /home/encode/enroll
docker compose -f infra/docker/docker-compose.yml up -d --build
```

## Stop services

```bash
docker compose -f infra/docker/docker-compose.yml down
```

## Notes

- Service registry is exposed on port `9001`
- Config server is exposed on port `9002`
- API gateway is exposed on port `9003`
- Auth service is exposed on port `9004`
- User service is exposed on port `9005`
- Core service is exposed on port `9006`
- Booking service is exposed on port `9007`
- Notification service is exposed on port `9008`
- Admin frontend is exposed on port `9009`
- Web frontend is exposed on port `9010`

If you need to use a different folder on the VDS, update the path in `.github/workflows/deploy.yml` accordingly.
