### STAGE 1: Build ###
FROM node:8.16 as builder

WORKDIR /code

COPY package.json package-lock.json /code/

RUN npm config set depth 0 && npm cache clean --force && npm install -q --no-progress

COPY . .

RUN npm run build

### STAGE 2: Setup ###
FROM nginx:1.13.3-alpine

## Copy our default nginx config
COPY nginx/gzip.conf /etc/nginx/conf.d/
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /code/dist /usr/share/nginx/html

CMD cp /usr/share/nginx/html/index.html /tmp/ && \
    cp /etc/nginx/conf.d/default.conf /tmp/ && \
    envsubst < /tmp/index.html > /usr/share/nginx/html/index.html && \
    envsubst '${prerender_server_ip} ${prerender_server_port}' < /tmp/default.conf > /etc/nginx/conf.d/default.conf && \
    nginx -g 'daemon off;'
