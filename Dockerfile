# ===================================================================
# QA Data Analysis Agent — Backend Dockerfile
# ===================================================================
# Python FastAPI backend with Uvicorn
# Entry point: api.py → app = FastAPI(...)
# Port: 8000 (configurable via PORT env var for Render)
# ===================================================================

FROM python:3.12-slim AS backend

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies for Python packages
# matplotlib: libpng, freetype, pkg-config
# pandas/numpy: may need build tools for some wheels
# reportlab: usually pure Python but may need libjpeg for images
# psycopg2-binary: pre-compiled, no system deps needed
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpng-dev \
    libfreetype6-dev \
    pkg-config \
    libjpeg-dev \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd --gid 1000 appuser && \
    useradd --uid 1000 --gid appuser --shell /bin/bash --create-home appuser

WORKDIR /app

# Install Python dependencies first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY api.py .
COPY main.py .
COPY src/ ./src/

# Copy sample datasets so the app has demo data on first run
COPY data/ ./data/

# Create writable directories for runtime outputs
RUN mkdir -p outputs logs/cache && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the backend API port (configurable via PORT env var)
EXPOSE 8000

# Health check against the /health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start FastAPI via Uvicorn
# Use PORT environment variable if set (for Render), otherwise default to 8000
CMD ["sh", "-c", "uvicorn api:app --host 0.0.0.0 --port ${PORT:-8000}"]