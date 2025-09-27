# --- Build stage (cần dev deps để build)
FROM node:24-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# --- Runtime stage (prod nhẹ)
FROM node:24-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY  . .
RUN npm run dev