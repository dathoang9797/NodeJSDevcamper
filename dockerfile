# ---- deps (prod deps only) ----
FROM node:24-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm ci


# ---- runner (prod) ----
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev

# ---- deps (prod deps only) ----              # Chia đoạn cho dễ đọc, không ảnh hưởng build
# FROM node:24-alpine AS dev                   # Dùng base Node 24 trên Alpine, stage tên "dev"
# WORKDIR /app                                 # Đặt thư mục làm việc là /app
# COPY package*.json ./                        # Copy package.json và package-lock.json để tận dụng cache
# RUN npm i                                    # Cài toàn bộ dependencies (kể cả devDependencies) cho môi trường dev

# # ---- runner (prod) ----                    # Stage chạy production, ảnh nhẹ hơn
# FROM node:24-alpine AS runner                # Base Node 24 Alpine, stage tên "runner"
# WORKDIR /app                                 # Thư mục làm việc /app
# ENV NODE_ENV=production                      # Biến môi trường production (một số lib tối ưu theo biến này)
# COPY package*.json ./                        # Copy manifest trước để cache bước cài đặt deps
# RUN npm i --omit=dev                         # Chỉ cài prod dependencies, bỏ devDependencies (npm v7+)
