FROM node:18.12-slim AS base
LABEL org.opencontainers.image.source https://github.com/pezzolabs/pezzo

RUN apt-get update
RUN apt-get install -y openssl curl

WORKDIR /app

COPY ./dist/apps/server/package*.json ./

RUN npm i --omit=dev

COPY ./dist/apps/server .
RUN chmod +x ./entrypoint.sh

RUN npx prisma generate

ENV PORT=3000
EXPOSE $PORT

ENTRYPOINT ["./entrypoint.sh"]