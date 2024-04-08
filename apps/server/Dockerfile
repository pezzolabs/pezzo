FROM node:18.12-slim AS base
LABEL org.opencontainers.image.source https://github.com/pezzolabs/pezzo

RUN apt-get update
RUN apt-get install -y openssl curl

WORKDIR /app

#COPY ./dist/apps/server/package*.json ./
COPY apps/server/package*.json ./

RUN npm i --omit=dev

#COPY ./dist/apps/server .
COPY apps/server .

RUN npx prisma generate

COPY ./clickhouse ./clickhouse

RUN cd clickhouse && npm i

ENV PORT=3000
EXPOSE $PORT

ENTRYPOINT ["node", "main.js"]
