FROM node:24-alpine AS dev
WORKDIR /app
COPY package*.json /app
RUN npm ci --omit=dev