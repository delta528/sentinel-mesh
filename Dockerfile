# Stage 1: Build & Dependency Isolation
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY src/ ./src/
COPY node_config.env.example ./node_config.env

EXPOSE 3000
USER node

CMD ["node", "src/server.js"]