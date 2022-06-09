FROM nginx

LABEL author="Thomas Kottke <t.kottke90@gmail.com>"
LABEL org.opencontainers.image.source=https://github.com/tkottke90/my-simple-tools

ARG GIT_COMMIT=""
ENV GIT_COMMIT=${GIT_COMMIT}

WORKDIR /usr/app

COPY ./config/nginx.conf /etc/nginx/conf.d/server.conf
COPY ./src /usr/app/public

EXPOSE 3000