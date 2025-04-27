FROM node:21 AS builder

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

FROM --platform=linux/amd64 nginx:1.25-alpine
COPY --from=builder /app/dist/ /usr/share/nginx/html
