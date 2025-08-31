# ---- deps (prod deps only) ----
FROM node:24-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm i


# ---- runner (prod) ----
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm i --omit=dev