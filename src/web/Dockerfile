# ── Stage 1 : build ──────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2 : serve ───────────────────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx:alpine traite automatiquement les fichiers *.template via envsubst
COPY default.conf.template /etc/nginx/templates/default.conf.template

ENV WEB_PORT=8095

EXPOSE ${WEB_PORT}

CMD ["nginx", "-g", "daemon off;"]
