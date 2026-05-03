#!/bin/sh
set -e
PORT=${PORT:-3001}
echo "Starting json-server on port $PORT"
exec json-server --watch server/db.json --port "$PORT"
