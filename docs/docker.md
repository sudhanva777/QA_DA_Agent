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
| `DATABASE_URL`        | **Yes**  | —                      | Neon PostgreSQL connection string        |
| `JWT_SECRET_KEY`      | **Yes**  | —                      | Secret for JWT token signing             |
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

- **SQLite**: Used for logging only — suitable for single-instance deployments
- **Neon PostgreSQL**: Used for user authentication (users table). This is the production database.
- For multi-instance production, the SQLite logging should be replaced with a centralized logging solution.

### File Storage

- **Uploaded datasets**: Stored on local filesystem (Docker volume `qa_data`)
- **Generated charts**: Stored in `outputs/` (Docker volume `qa_outputs`)
- **PDF reports**: Generated on-demand and streamed to client (not stored)
- For production, consider object storage (S3, GCS) for uploaded files

### Security

- The backend runs as a non-root user (`appuser`)
- No secrets are baked into Docker images
- `.env` is excluded from both `.gitignore` and `.dockerignore`
- The Nginx proxy limits upload size to 50MB (matching backend)

---

## Render Deployment

### Prerequisites

1. A [Render](https://render.com/) account
2. A [Neon](https://neon.tech/) PostgreSQL database
3. A [Groq](https://console.groq.com/) API key

### Backend Service (Web Service)

1. Create a new **Web Service** in Render
2. Connect your GitHub/GitLab repository
4. Configure:
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`
5. Add Environment Variables in Render Dashboard:
   - `GROQ_API_KEY`: Your Groq API key
   - `DATABASE_URL`: Neon PostgreSQL connection string (e.g., `postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require`)
   - `JWT_SECRET_KEY`: Generated secret (run `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
   - `GROQ_MODEL`: `openai/gpt-oss-120b` (or your preferred model)
   - `ALLOWED_ORIGINS`: `https://your-frontend-domain.onrender.com`
   - `ENABLE_OPENAPI_DOCS`: `true`
6. Health Check Path: `/health`
7. Deploy!

The backend will be available at `https://your-api-name.onrender.com`

### Frontend Service (Static Site)

1. Create a new **Static Site** in Render
2. Connect the same repository
3. Configure:
   - **Build Command**: `cd frontend && npm ci && npm run build`
   - **Publish Directory**: `frontend/dist`
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-api-name.onrender.com`
5. Deploy!

The frontend will be available at `https://your-frontend-name.onrender.com`

### Alternative: Frontend as Web Service (Docker)

If you prefer Docker for the frontend:

1. Create a new **Web Service**
2. **Runtime**: Docker
3. **Dockerfile Path**: `./frontend/Dockerfile`
4. **Docker Context**: `./frontend`
5. Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-api-name.onrender.com`
6. Health Check Path: `/`

### Neon PostgreSQL Setup

1. Create a Neon project at [neon.tech](https://neon.tech)
2. Create a database (e.g., `qa_analysis`)
3. Copy the connection string (pooled connection recommended)
4. Add to Render as `DATABASE_URL`
5. Run migrations locally or via Render shell:
   ```bash
   alembic upgrade head
   ```

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

---

## Development vs Production

| Aspect | Development (Docker Compose) | Production (Render) |
|--------|-----------------------------|---------------------|
| Frontend | Nginx + Reverse Proxy | Static Site or Docker Web Service |
| Backend | Docker Container | Docker Web Service |
| Database | Neon (external) | Neon (external) |
| Auth DB | Neon PostgreSQL | Neon PostgreSQL |
| Logging | SQLite (logs/) | SQLite (ephemeral) |
| File Storage | Docker Volumes | Ephemeral (consider S3) |
| TLS | None (HTTP) | Automatic (HTTPS) |
| CORS | localhost origins | Production domain |

---

## Security Checklist

- [ ] `GROQ_API_KEY` never committed to Git
- [ ] `DATABASE_URL` never committed to Git
- [ ] `JWT_SECRET_KEY` never committed to Git
- [ ] `.env` in `.gitignore` and `.dockerignore`
- [ ] No hardcoded secrets in Dockerfile or docker-compose.yml
- [ ] Backend runs as non-root user (`appuser`)
- [ ] Nginx upload limit matches backend (50MB)
- [ ] CORS configured with specific origins (not `*`)
- [ ] JWT tokens use secure signing (HS256)
- [ ] Passwords hashed with bcrypt (never stored in plaintext)