# syntax=docker/dockerfile:1
# check=error=true

# This Dockerfile is designed for production, not development. Use with Kamal or build'n'run by hand:
# docker build -t annemame .
# docker run -d -p 80:80 --name annemame annemame
#
FROM node:alpine AS base

WORKDIR /eleventy

# Install packages
COPY package.json package-lock.json ./
RUN npm install

# Build the site
FROM base AS build
COPY . .
RUN ./bin/build

# Serve the site
FROM nginx
COPY --from=build ./eleventy/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
