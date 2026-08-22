# Docker Deployment Guide — QA Data Analysis Agent

## Architecture

```
Browser (http://localhost:3000)
   │
   ▼
┌─────────────────────────────────┐
│  Frontend Container (Nginx)     │
│  Port: 3000 → 80 (internal)    │
│  - Serves React SPA             │
│  - Reverse proxies /api/* to    │
│    backend container             │
└────────────┬────────────────────┘
             │ Docker internal network
             ▼
┌─────────────────────────────────┐
│  Backend Container (Uvicorn)    │
│  Port: 8000                     │
│  - FastAPI REST API              │
│  - Sandboxed code execution      │
│  - SQLite logging (logs/)        │
│  - Chart generation (outputs/)   │
│  - Dataset storage (data/)       │
└────────────┬────────────────────┘
             │ HTTPS
             ▼
┌─────────────────────────────────┐
│  Groq AI API (external)        │
│  LLM inference for Q&A          │
└─────────────────────────────────┘
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
- A valid `GROQ_API_KEY` from [Groq Console](https://console.groq.com/)

## Quick Start

### 1. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY=gsk_your_actual_key_here
```

### 2. Build

```bash
docker compose build
```

### 3. Run

```bash
docker compose up -d
```

### 4. Access

- **Application UI**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## Commands Reference

### Start (detached)

```bash
docker compose up -d
```

### Start (with logs)

```bash
docker compose up
```

### Stop

```bash
docker compose down
```

### Rebuild (after code changes)

```bash
docker compose build
docker compose up -d
```

### Rebuild (clean, no cache)

```bash
docker compose build --no-cache
docker compose up -d
```

### View all logs

```bash
docker compose logs -f
```

### Backend logs only

```bash
docker compose logs -f backend
```

### Frontend logs only

```bash
docker compose logs -f frontend
```

### Check container status

```bash
docker compose ps
```

### Restart a single service

```bash
docker compose restart backend
```

---

## Ports

| Service  | Container Port | Host Port | Description                    |
|----------|---------------|-----------|--------------------------------|
| Frontend | 80            | 3000      | Nginx serving React SPA        |
| Backend  | 8000          | 8000      | FastAPI / Uvicorn API server   |

## Environment Variables

| Variable              | Required | Default                | Description                              |
|-----------------------|----------|------------------------|------------------------------------------|
| `GROQ_API_KEY`        | **Yes**  | —                      | API key for Groq LLM inference           |
| `GROQ_MODEL`          | No       | `openai/gpt-oss-120b`  | LLM model identifier                     |
| `ALLOWED_ORIGINS`     | No       | `localhost:3000,5173`   | CORS allowed origins (comma-separated)   |
| `ENABLE_OPENAPI_DOCS` | No       | `true`                 | Enable /docs and /redoc endpoints        |
| `ENABLE_PLANNER`      | No       | `false`                | Enable analysis planning step            |

> **Security**: Never commit `.env` to Git. The `.gitignore` already excludes it. API keys are injected at runtime via `env_file` in `docker-compose.yml`.

## Volumes

| Volume       | Container Path | Purpose                                    |
|-------------|----------------|--------------------------------------------|
| `qa_data`   | `/app/data`    | Uploaded and sample datasets               |
| `qa_logs`   | `/app/logs`    | SQLite database + JSON cache               |
| `qa_outputs`| `/app/outputs` | Generated chart images                     |

These named volumes ensure data persists across container restarts.

### Managing Volumes

```bash
# List volumes
docker volume ls | grep qa_

# Inspect a volume
docker volume inspect qa-da-agent_qa_data

# Remove all volumes (WARNING: deletes all data)
docker compose down -v
```

---

## Networking

- The **frontend** (Nginx) acts as a reverse proxy
- Browser requests to `http://localhost:3000/api/*` are forwarded internally to `http://backend:8000/api/*`
- Browser requests to `http://localhost:3000/outputs/*` are forwarded to `http://backend:8000/outputs/*`
- The frontend and backend communicate over Docker's internal bridge network
- The browser never needs to resolve Docker service names — all routing goes through Nginx

## Health Checks

Both services have health checks configured:

- **Backend**: `curl -f http://localhost:8000/health` every 30s
- **Frontend**: `wget --spider http://localhost:80/` every 30s

The frontend service waits for the backend to become healthy before starting (`depends_on: condition: service_healthy`).

---

## Production Considerations

### Scaling
- For production, consider placing an external reverse proxy (e.g., Caddy, Traefik) in front for TLS termination
- The backend is single-process Uvicorn; for higher throughput, use `--workers N` or Gunicorn with Uvicorn workers

### Database
- SQLite is used for logging only — suitable for single-instance deployments
- For multi-instance production, consider migrating to PostgreSQL

### File Storage
- Uploaded datasets are stored on the local filesystem (Docker volume)
- For production, consider object storage (S3, GCS) for uploaded files

### Security
- The backend runs as a non-root user (`appuser`)
- No secrets are baked into Docker images
- `.env` is excluded from both `.gitignore` and `.dockerignore`
- The Nginx proxy limits upload size to 50MB (matching backend)

---

## Troubleshooting

### Backend fails to start: "GROQ_API_KEY not found"

Make sure your `.env` file exists in the project root and contains a valid key:
```
GROQ_API_KEY=gsk_your_key_here
```

### Frontend shows "502 Bad Gateway"

The backend hasn't started yet. Check backend logs:
```bash
docker compose logs backend
```

Wait for the health check to pass:
```bash
docker compose ps
```

### Port already in use

Change the host port mapping in `docker-compose.yml`:
```yaml
ports:
  - "3001:80"   # Change 3000 to 3001
```

### File upload fails

Verify the upload size limit. The Nginx config and backend both allow up to 50MB.

### Charts not displaying

Charts are served via the `/outputs/` proxy. Check that:
1. The backend `outputs/` directory is writable
2. The Nginx proxy is forwarding `/outputs/` correctly:
```bash
curl http://localhost:3000/outputs/
```

### Container won't build

Try a clean rebuild:
```bash
docker compose build --no-cache
```

### Reset all data

```bash
docker compose down -v
docker compose up -d
```
