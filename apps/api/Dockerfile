
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/ ./packages/

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY apps/api/ ./apps/api/
COPY shared/ ./shared/

# Variables d'environnement obligatoires pour mode offline
ENV OFFLINE_MODE=true
ENV NO_EXTERNAL_CALLS=true
ENV NODE_ENV=production

WORKDIR /app/apps/api

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
