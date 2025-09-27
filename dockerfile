# --- Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# --- Runtime stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
# cài prod deps
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
# copy mã đã build
COPY --from=build /app/dist ./dist
# Render sẽ gán PORT -> app phải listen PORT này
EXPOSE 8080
CMD ["node", "dist/server.js"]
