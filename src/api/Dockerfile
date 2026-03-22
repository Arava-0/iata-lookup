# ── Stage 1 : build ──────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src/api ./src/api
RUN npm run build

# ── Stage 2 : run ─────────────────────────────────────────────────────────────
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV PORT=8096
ENV NODE_ENV=production

EXPOSE ${PORT}

CMD ["node", "dist/src/api/index.js"]
