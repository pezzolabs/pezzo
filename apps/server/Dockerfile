FROM node:18.12.1-slim AS base

RUN apt-get update
RUN apt-get install -y openssl

WORKDIR /app

COPY ./dist/apps/server/package*.json ./

RUN npm i --omit=dev

COPY ./dist/apps/server .

RUN npx prisma generate

ENV PORT=3000
EXPOSE $PORT

ENTRYPOINT ["node", "main.js"]