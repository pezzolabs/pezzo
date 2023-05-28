FROM node:18.12-slim AS base
LABEL org.opencontainers.image.source https://github.com/pezzolabs/pezzo

RUN apt-get update && \
    apt-get install -y openssl curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Dependencies
FROM base AS dependencies
COPY ./dist/apps/server/package*.json ./
# Install production dependencies only
RUN npm ci --only=production

# Copy production dependencies
FROM base AS release
COPY --from=dependencies /app/node_modules ./node_modules
COPY ./dist/apps/server ./
RUN chmod +x ./entrypoint.sh && npx prisma generate

ENV PORT=3000
EXPOSE $PORT

ENTRYPOINT ["./entrypoint.sh"]