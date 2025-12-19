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

# Copy Payload standalone build
# The standalone output contains server.js and minimal node_modules
# We need to preserve the structure and add static + public files
COPY --from=payload-builder /app/payload/.next/standalone ./payload
COPY --from=payload-builder /app/payload/.next/static ./payload/.next/static
COPY --from=payload-builder /app/payload/public ./payload/public
# Copy additional node_modules that standalone needs (Payload-specific)
# The 'next' package is in the workspace root node_modules
COPY --from=payload-builder /app/node_modules/next ./payload/node_modules/next

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
