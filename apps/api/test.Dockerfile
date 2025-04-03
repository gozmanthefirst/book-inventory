FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat

# Set up the application directory
WORKDIR /app

# Copy root package files for the monorepo
COPY pnpm-workspace.yaml package.json ./
COPY pnpm-lock.yaml ./

# Copy packages directory if you have shared packages
COPY packages ./packages

# Copy just the API app source
COPY apps/api ./apps/api

# Install dependencies using pnpm workspace features
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    cd apps/api && \
    pnpm exec prisma generate && \
    rm -rf dist && \
    pnpm build

# Production stage with only essential files
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono

# Copy workspace files and dependencies
COPY --from=builder --chown=hono:nodejs /app/package.json ./
COPY --from=builder --chown=hono:nodejs /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=hono:nodejs /app/pnpm-lock.yaml ./
COPY --from=builder --chown=hono:nodejs /app/packages ./packages
COPY --from=builder --chown=hono:nodejs /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=hono:nodejs /app/apps/api/prisma ./apps/api/prisma

# Install production dependencies and generate Prisma client
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile && \
    cd apps/api && \
    pnpm exec prisma generate

# Copy built application
COPY --from=builder --chown=hono:nodejs /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=hono:nodejs /app/apps/api/.env ./apps/api/.env

# Set the working directory to the api app
WORKDIR /app/apps/api

# Set the environment variable
ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0" \
    PORT=8000

# Use non-root user
USER hono

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["node", "dist/index.js"]