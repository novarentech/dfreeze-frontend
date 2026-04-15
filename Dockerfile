# ── Stage 1: Install dependencies ──────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: Build ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 3: Runner ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

RUN addgroup -S app && adduser -S app -G app
USER app

COPY --from=builder /app/dist/server ./server
COPY --from=builder /app/dist/client ./client
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 4321

CMD ["node", "./server/entry.mjs"]