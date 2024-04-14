FROM node:20-alpine as builder

WORKDIR /app

COPY . .
RUN npm install
RUN npx nx run proxy:build


FROM node:20-alpine
LABEL org.opencontainers.image.source https://github.com/pezzolabs/pezzo/proxy

RUN apk update

WORKDIR /app

COPY app/dist/apps/proxy/package*.json ./
#COPY apps/proxy/package*.json ./

RUN npm i --omit=dev

COPY app/dist/apps/proxy .
#COPY apps/proxy .

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE $PORT

ENTRYPOINT ["node", "main.js"]
