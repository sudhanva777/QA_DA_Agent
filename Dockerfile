# ===================================================================
# QA Data Analysis Agent — Single Container Deployment
# ===================================================================
# Multi-stage build:
# Stage 1: Node.js - Build React frontend
# Stage 2: Python - Install FastAPI dependencies
# Stage 3: Runtime - Nginx + Python + Supervisord
# ===================================================================

# ─────────────────────────────────────────────────────────────────
# Stage 1: Build React Frontend
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

# Copy package files first for layer caching
COPY frontend/package.json frontend/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy frontend source files
COPY frontend/index.html ./
COPY frontend/vite.config.js ./
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/.oxlintrc.json ./
COPY frontend/public/ ./public/
COPY frontend/src/ ./src/

# Build production bundle - API base URL is empty for same-origin requests
ENV VITE_API_BASE_URL=""
RUN npm run build

# ─────────────────────────────────────────────────────────────────
# Stage 2: Install Python Dependencies
# ─────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS python-deps

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies for Python packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpng-dev \
    libfreetype6-dev \
    pkg-config \
    libjpeg-dev \
    curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────────────────────────────
# Stage 3: Runtime - Nginx + Python + Supervisord
# ─────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install runtime system dependencies: Nginx, Supervisord, and Python package runtime deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    gettext \
    gosu \
    libpng-dev \
    libfreetype6-dev \
    libjpeg-dev \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid 1000 appuser && \
    useradd --uid 1000 --gid appuser --shell /bin/bash --create-home appuser

WORKDIR /app

# Copy Python dependencies from python-deps stage
COPY --from=python-deps /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=python-deps /usr/local/bin /usr/local/bin

# Copy backend source code
COPY api.py .
COPY main.py .
COPY src/ ./src/

# Copy frontend build output from frontend-build stage
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy Nginx configurations
COPY nginx-main.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Copy Supervisord configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create required directories
RUN mkdir -p data outputs logs/cache logs/nginx /tmp/nginx/client_body /tmp/nginx/proxy /tmp/nginx/fastcgi /tmp/nginx/uwsgi /tmp/nginx/scgi && \
    chown -R appuser:appuser /app /usr/share/nginx/html /tmp/nginx

# Expose HTTP port (Nginx) - default 80, Render will override with PORT
EXPOSE 80

# Health check against Nginx (which proxies to FastAPI /health)
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:${PORT:-80}/health || exit 1

# Start via entrypoint script (handles PORT substitution, runs as root then drops to appuser)
ENTRYPOINT ["/docker-entrypoint.sh"]