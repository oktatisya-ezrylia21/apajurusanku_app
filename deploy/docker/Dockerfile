# Image untuk backend + frontend (frontend disajikan Express).
# Build dari ROOT proyek:  docker build -f deploy/docker/Dockerfile -t apajurusanku .
FROM node:20-bookworm-slim
WORKDIR /app

COPY backend/package*.json backend/
RUN cd backend && npm install --omit=dev

COPY backend backend
COPY frontend frontend

ENV NODE_ENV=production PORT=3000 DB_PATH=/data/apajurusanku.sqlite
WORKDIR /app/backend
EXPOSE 3000
CMD ["node", "src/server.js"]
