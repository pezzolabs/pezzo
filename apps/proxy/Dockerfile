FROM node:20-alpine
LABEL llm-ops-proxy

RUN apk update

WORKDIR /app

#COPY ./dist/apps/proxy/package*.json ./
COPY apps/proxy/package*.json ./

RUN npm i --omit=dev

#COPY ./dist/apps/proxy .
COPY apps/proxy .

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE $PORT

ENTRYPOINT ["node", "main.js"]
