FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist/erp-frontend /app/dist
RUN npm install -g serve

EXPOSE 80
CMD ["serve", "-s", "/app/dist", "-l", "80"]
