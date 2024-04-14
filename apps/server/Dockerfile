FROM node:18.12-slim AS base

WORKDIR /app

COPY . .
RUN npm install
RUN npx nx run server:build


FROM node:18.12-slim

LABEL org.opencontainers.image.source https://github.com/pezzolabs/pezzo

RUN apt-get update
RUN apt-get install -y openssl curl

COPY --from=base app/dist/apps/server/package*.json ./
#COPY apps/server/package*.json ./

RUN npm i --omit=dev

COPY --from=builder app/dist/apps/server .
#COPY apps/server .

RUN npx prisma generate

COPY ./clickhouse ./clickhouse

RUN cd clickhouse && npm i

ENV PORT=3000
EXPOSE $PORT

ENTRYPOINT ["node", "main.js"]
