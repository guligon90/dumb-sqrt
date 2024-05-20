# Stage 1
FROM node:lts-alpine as builder

WORKDIR /app

COPY ./package.json ./yarn.lock ./
RUN yarn install

COPY ./src ./src

COPY ./tsconfig.json ./tsconfig.json

RUN yarn build

# Stage 2
FROM nginx:alpine

COPY ./infra/docker/server/nginx.conf /etc/nginx/nginx.conf
COPY ./infra/docker/server/mime.types /etc/nginx/mime.types

COPY ./css /usr/share/nginx/html/css
COPY ./fonts /usr/share/nginx/html/fonts
COPY ./index.html /usr/share/nginx/html/index.html
COPY --from=builder app/build /usr/share/nginx/html/build
