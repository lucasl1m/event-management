FROM node:24-alpine
WORKDIR /app
RUN npm install -g json-server@0.17.4
COPY server/ ./server/
CMD ["sh", "-c", "json-server --watch server/db.json --port ${PORT:-3001}"]
