# Database Setup & Architecture

## Overview

This document describes the PostgreSQL database setup for the QA Data Analysis Agent, including Neon PostgreSQL configuration, SQLAlchemy ORM models, Alembic migrations, and authentication architecture.

## Architecture

```
React Frontend (Port 3000/5173)
        ↓
Nginx Reverse Proxy (Docker)
        ↓
FastAPI Backend (Port 8000)
        ↓
PostgreSQL (Neon Cloud)
```

- **Frontend** never connects directly to the database
- **Backend** uses SQLAlchemy 2.0 with asyncpg/psycopg2 drivers
- **Database** runs on Neon (serverless PostgreSQL), not in Docker
- **Migrations** managed via Alembic

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require` |
| `JWT_SECRET_KEY` | Secret for signing JWT tokens (32+ chars) | Generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `GROQ_API_KEY` | Groq API key for LLM | `gsk_...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173,http://localhost:3000` |
| `ENABLE_OPENAPI_DOCS` | Enable Swagger/Redoc docs | `true` |
| `GROQ_MODEL` | LLM model to use | `openai/gpt-oss-120b` |

## Neon PostgreSQL Setup

### 1. Create a Neon Project

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project
3. Choose a region close to your deployment
4. Note the connection string from the dashboard

### 2. Connection String Format

Neon provides connection strings in this format:

```
postgresql://<user>:<password>@<endpoint>/<database>?sslmode=require
```

Example:
```
postgresql://alex:AbC123@ep-cool-darkness-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 3. Important Notes

- **Always use `sslmode=require`** - Neon enforces SSL
- **Pooled vs Direct connection** - For serverless, use the pooled connection string (includes `-pooler` in hostname)
- **Branch connections** - Neon supports branching; each branch gets its own connection string
- **IP Allowlist** - Configure IP allowlist in Neon dashboard for production

## Local Development

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Configure `.env`

```env
GROQ_API_KEY=your_groq_key
DATABASE_URL=postgresql://user:pass@localhost:5432/qadata  # Local PostgreSQL
# OR for Neon:
# DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require
JWT_SECRET_KEY=your_32_char_secret
```

### 3. Start Local PostgreSQL (Optional)

Using Docker:
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_DB=qadata \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=pass \
  -p 5432:5432 \
  postgres:16
```

### 4. Run Migrations

```bash
# Generate initial migration (if needed)
alembic revision --autogenerate -m "initial"

# Apply migrations
alembic upgrade head
```

### 5. Start Backend

```bash
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX ix_users_email ON users(email);
```

### Future Tables (Planned)

| Table | Purpose |
|-------|---------|
| `datasets` | User-uploaded dataset metadata |
| `analyses` | Analysis sessions/questions |
| `conversations` | Chat conversation history |
| `messages` | Individual messages in conversations |
| `analysis_history` | Historical analysis results |

## Alembic Migrations

### Commands

```bash
# Create new migration (auto-generate from models)
alembic revision --autogenerate -m "description"

# Create empty migration
alembic revision -m "description"

# Apply all pending migrations
alembic upgrade head

# Apply specific migration
alembic upgrade <revision>

# Rollback one migration
alembic downgrade -1

# Show current revision
alembic current

# Show migration history
alembic history

# Show SQL for migration (dry run)
alembic upgrade head --sql
```

### Migration Files

Located in `alembic/versions/` with format: `<timestamp>_<slug>.py`

### Best Practices

1. **Always review auto-generated migrations** before applying
2. **Test migrations locally** before deploying
3. **Never edit applied migrations** - create new ones instead
4. **Use descriptive messages** for migration names
5. **Backup production data** before major migrations

## Authentication Architecture

### JWT Token Flow

```
Register/Login
      ↓
Backend validates credentials
      ↓
Creates JWT with user_id (sub) and email
      ↓
Returns token to frontend
      ↓
Frontend stores token in localStorage
      ↓
Frontend sends Authorization: Bearer <token> header
      ↓
Backend validates token on protected routes
      ↓
Returns user data or 401
```

### Token Details

- **Algorithm**: HS256
- **Expiration**: 7 days (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`)
- **Payload**: `{ "sub": "<user_id>", "email": "<email>", "exp": <timestamp> }`
- **Secret**: `JWT_SECRET_KEY` environment variable

### Password Security

- **Hashing**: bcrypt (via passlib)
- **Cost Factor**: 12 (default)
- **Never stored in plaintext**
- **Never returned in API responses**

### Protected Routes

Backend endpoints requiring authentication:
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout (client-side token removal)
- All dataset/analysis endpoints (future)

### CORS Configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # From environment
    allow_credentials=True,         # Required for cookies/auth
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Docker Deployment

### Backend Container

The backend Dockerfile installs dependencies from `requirements.txt` including:
- `sqlalchemy>=2.0.0`
- `alembic>=1.13.0`
- `asyncpg>=0.29.0`
- `psycopg2-binary>=2.9.0`
- `python-jose[cryptography]>=3.3.0`
- `passlib[bcrypt]>=1.7.4`

### Environment Injection

In `docker-compose.yml`:
```yaml
services:
  backend:
    env_file:
      - .env
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
```

**Never commit real credentials to git.** Use `.env` file (gitignored) for local development and platform secrets for production.

## Troubleshooting

### Connection Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `DATABASE_URL not found` | Env var missing | Set `DATABASE_URL` in `.env` or platform |
| `sslmode=require` errors | Wrong connection string | Use Neon pooled connection string |
| `connection timeout` | IP not allowed | Add IP to Neon allowlist |
| `authentication failed` | Wrong credentials | Verify user/password in Neon dashboard |

### Migration Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `target database not up to date` | Pending migrations | Run `alembic upgrade head` |
| `can't locate revision` | Corrupt migration history | Check `alembic_version` table |
| `duplicate key` | Data conflicts | Fix data or create manual migration |

### Auth Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid or expired token` | Token expired | Re-login |
| `401 Unauthorized` | Missing/invalid header | Check `Authorization: Bearer <token>` |
| `CORS error` | Origin not allowed | Add origin to `ALLOWED_ORIGINS` |

## Security Checklist

- [ ] `DATABASE_URL` never committed to git
- [ ] `JWT_SECRET_KEY` is 32+ random characters
- [ ] `JWT_SECRET_KEY` never committed to git
- [ ] Passwords hashed with bcrypt (never plaintext)
- [ ] CORS origins explicitly configured (not `*`)
- [ ] `allow_credentials=True` only with specific origins
- [ ] HTTPS enforced in production (Neon requires SSL)
- [ ] Rate limiting on auth endpoints (future)
- [ ] Token refresh mechanism (future)

## Running Migrations in CI/CD

```yaml
# Example GitHub Actions step
- name: Run Database Migrations
  run: |
    cd backend
    alembic upgrade head
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Useful Commands

```bash
# Check database connection
python -c "from src.db.postgresql import engine; print(engine.url)"

# Create admin user (if needed)
python -c "
from src.services.auth import register_user
register_user('Admin', 'admin@example.com', 'securepassword123')
"

# View current migration
alembic current

# Reset database (DANGEROUS - destroys data)
alembic downgrade base
alembic upgrade head
```