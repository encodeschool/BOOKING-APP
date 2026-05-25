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

- Frontend web app is exposed on port `3001`
- Admin frontend is exposed on port `3000`
- API gateway is exposed on port `9080`
- Service registry is exposed on port `8761`
- Config server is exposed on port `8888`

If you need to use a different folder on the VDS, update the path in `.github/workflows/deploy.yml` accordingly.
