FROM node:24-slim  AS dev
RUN apt-get update && apt-get install -y
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY  . .
CMD ["npm", "run", "dev"]

FROM node:24-slim  AS prod
RUN apt-get update && apt-get install -y
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
CMD ["npm", "run", "start"]