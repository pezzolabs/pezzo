FROM node:20-alpine as builder
#ARG ENV_NAME
WORKDIR /app
#COPY . .
RUN npm install
RUN #npm run build:${ENV_NAME}
RUN npx nx run console:build

#FROM nginx:alpine as production
#ENV NODE_ENV production
#COPY --from=builder /app/dist /usr/share/nginx/html
#
#COPY nginx.local.conf /etc/nginx/conf.d/default.conf
#EXPOSE 4400
#CMD ["nginx", "-g", "daemon off;"]

FROM nginx:1.20-alpine
LABEL org.opencontainers.image.source https://github.com/pezzolabs/pezzo

RUN apk add --update nodejs

WORKDIR /app

RUN #npx nx run console:build

# update file path based on real path
COPY --from=builder dist/apps/console/nginx.conf /etc/nginx/conf.d/default.conf
#COPY apps/console/nginx.conf /etc/nginx/conf.d/default.conf
#COPY apps/dist/apps/console/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/apps/console .
#COPY apps/dist/apps/console .
#COPY apps/console/ .

RUN chmod +x scripts/entrypoint.sh

ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
