FROM nginx:1.20-alpine
LABEL org.opencontainers.image.source https://github.com/pezzolabs/pezzo

RUN apk add --update nodejs

WORKDIR /app

# update file path based on real path
#COPY dist/apps/console/nginx.conf /etc/nginx/conf.d/default.conf
COPY apps/console/nginx.conf /etc/nginx/conf.d/default.conf
#COPY dist/apps/console .
COPY apps/dist/apps/console .
#COPY apps/console/ .

RUN chmod +x scripts/entrypoint.sh

ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
