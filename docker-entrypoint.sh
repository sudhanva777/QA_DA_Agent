#!/bin/sh
set -e

# Render provides PORT environment variable (e.g., 10000)
# Default to 80 for local development
PORT="${PORT:-80}"
export PORT

# Create Nginx runtime directories BEFORE nginx -t
# These are lost at container startup because /tmp is a fresh tmpfs
mkdir -p /tmp/nginx/client_body \
         /tmp/nginx/proxy \
         /tmp/nginx/fastcgi \
         /tmp/nginx/uwsgi \
         /tmp/nginx/scgi

# Ensure Nginx can write to them (nginx runs as root in this container)
chmod 755 /tmp/nginx /tmp/nginx/client_body /tmp/nginx/proxy /tmp/nginx/fastcgi /tmp/nginx/uwsgi /tmp/nginx/scgi

# Substitute PORT in nginx configuration
envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Verify nginx configuration
nginx -t

# Start supervisord as root (so it can start nginx as root for port binding)
# FastAPI will run as appuser via supervisord config
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf