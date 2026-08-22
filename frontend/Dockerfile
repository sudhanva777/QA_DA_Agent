# ===================================================================
# QA Data Analysis Agent — Frontend Dockerfile (Multi-Stage)
# ===================================================================
# Stage 1: Build React/Vite app with Node.js
# Stage 2: Serve static assets with Nginx + reverse proxy config
# ===================================================================

# ── Stage 1: Build ──
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install dependencies using ci for reproducible builds
RUN npm ci

# Copy source files
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY .oxlintrc.json ./
COPY public/ ./public/
COPY src/ ./src/

# Set API base URL to empty string — all API calls go through
# Nginx reverse proxy on same origin (no cross-origin issues)
ENV VITE_API_BASE_URL=""

# Build production bundle
RUN npm run build

# ── Stage 2: Serve ──
FROM nginx:alpine AS production

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config with SPA fallback + reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check against the frontend
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
