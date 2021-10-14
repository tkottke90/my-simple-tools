FROM nginx

ARG GIT_COMMIT=""
ENV GIT_COMMIT=${GIT_COMMIT}

WORKDIR /usr/app

COPY ./config/nginx.conf /etc/nginx/conf.d/server.conf
COPY ./src /usr/app/public

EXPOSE 3000