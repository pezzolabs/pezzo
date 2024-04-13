#FROM node:20-alpine as builder
#WORKDIR /app
#COPY . .
#RUN npm install
#RUN npx nx run console:build

FROM nginx:1.20-alpine
LABEL org.opencontainers.image.source https://github.com/pezzolabs/pezzo

RUN apk add --update nodejs npm

WORKDIR /app
COPY . .
RUN npm install
RUN nx run console:build

# update file path based on real path
COPY dist/apps/console/nginx.conf /etc/nginx/conf.d/default.conf
#COPY apps/console/nginx.conf /etc/nginx/conf.d/default.conf
#COPY apps/dist/apps/console/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/apps/console .
#COPY apps/dist/apps/console .
#COPY apps/console/ .

RUN chmod +x scripts/entrypoint.sh

ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
