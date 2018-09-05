### STAGE 1: Build ###
FROM node:6.3 as builder

WORKDIR /code

COPY package.json .

RUN npm config set depth 0 && npm cache clean --force && npm install -q --no-progress

COPY . .

RUN npm run build

