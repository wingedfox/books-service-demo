FROM node:8-alpine
MAINTAINER Ilya Lebedev <ilya@lebedev.net>

RUN apk update && \
    apk add --no-cache openssh-client mysql-client git

ARG APP_DIR=/opt/app

RUN mkdir -p ${APP_DIR} && \
    mkdir ~/.ssh/ && \
    touch ~/.ssh/known_hosts && \
    ssh-keyscan -t rsa github.com > ~/.ssh/known_hosts

ARG NPM_OPTIONS=
RUN    export && npm ${NPM_OPTIONS} install -g pm2@2.10.4

WORKDIR ${APP_DIR}

COPY package.json package-lock.json ./

RUN npm ${NPM_OPTIONS} install && \
    apk del git openssh-client

COPY . .

CMD ["sh", "scripts/entrypoint.sh"]
