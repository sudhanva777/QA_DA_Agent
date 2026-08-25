#!/bin/sh
set -e

# Render provides PORT environment variable (e.g., 10000)
# Default to 80 for local development
PORT="${PORT:-80}"
export PORT

# Substitute PORT in nginx configuration
envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Verify nginx configuration
nginx -t

# Start supervisord as root (so it can start nginx as root for port binding)
# FastAPI will run as appuser via supervisord config
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf