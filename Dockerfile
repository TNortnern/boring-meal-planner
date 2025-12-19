# Multi-stage build for BORING Meal Planner mono-app
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

# ============================================
# Dependencies Stage
# ============================================
FROM base AS deps
WORKDIR /app

# Copy root workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY payload/package.json ./payload/
COPY nuxt/package.json ./nuxt/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# ============================================
# Build Payload
# ============================================
FROM base AS payload-builder
WORKDIR /app/payload

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/payload/node_modules ./node_modules
COPY payload/ ./

# Build Payload with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ============================================
# Build Nuxt
# ============================================
FROM base AS nuxt-builder
WORKDIR /app/nuxt

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/nuxt/node_modules ./node_modules
COPY nuxt/ ./

# Build Nuxt
RUN pnpm build

# ============================================
# Production Runner
# ============================================
FROM base AS runner
WORKDIR /app

# Copy Payload build (non-standalone approach for reliability)
# Copy entire .next directory
COPY --from=payload-builder /app/payload/.next ./payload/.next
COPY --from=payload-builder /app/payload/public ./payload/public
COPY --from=payload-builder /app/payload/package.json ./payload/
# Copy all necessary node_modules for Payload
COPY --from=deps /app/node_modules ./payload/node_modules
COPY --from=deps /app/payload/node_modules ./payload/node_modules

# Copy Nuxt output
COPY --from=nuxt-builder /app/nuxt/.output ./nuxt/.output

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start both services
CMD ["./start.sh"]
