FROM node:24-alpine
WORKDIR /app
RUN npm install -g json-server@0.17.4
COPY server/ ./server/
RUN chmod +x server/start.sh
CMD ["sh", "server/start.sh"]
