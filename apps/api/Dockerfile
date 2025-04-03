FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat

# Set up the application directory
WORKDIR /app

# Copy root package files for the monorepo
# This is a monorepo, so we need to copy the workspace files
# and the root package.json to install dependencies
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copy packages directory if you have shared packages
COPY packages ./packages

# Copy everything required for the API app to work
COPY apps/api/package.json ./apps/api/package.json
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
COPY apps/api/.env ./apps/api/.env
COPY apps/api/src ./apps/api/src
COPY apps/api/prisma ./apps/api/prisma

# Install dependencies using pnpm workspace features and build application
RUN npm install -g pnpm && \
    pnpm install --recursive --filter=api --filter=@repo/eslint-config --filter=@repo/typescript-config --frozen-lockfile && \
    cd apps/api && \
    pnpm exec prisma generate && \
    pnpm build && \
    pnpm prune --prod

# Production stage with only essential files
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono

# Copy workspace files and dependencies
COPY --from=builder --chown=hono:nodejs /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=builder --chown=hono:nodejs /app/packages ./packages
COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/apps/api/node_modules /app/apps/api/node_modules
COPY --from=builder --chown=hono:nodejs /app/apps/api/dist /app/apps/api/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=hono:nodejs /app/apps/api/package.json /app/apps/api/package.json
COPY --from=builder --chown=hono:nodejs /app/apps/api/.env /app/apps/api/.env

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
