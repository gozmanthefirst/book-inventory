FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat

# Set up the application directory
WORKDIR /app

# Copy package files first (for better caching)
COPY pnpm-lock.yaml package.json tsconfig.json .env ./

# Copy source code and prisma while preserving directory structure
COPY src ./src
COPY prisma ./prisma

# Install dependencies and build application
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile && \
    pnpm exec prisma generate && \
    pnpm build && \
    pnpm prune --prod

# Production stage with only essential files
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json
COPY --from=builder /app/.env /app/.env

# Set the environment variable
ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0" \
    PORT=8000

# Use non-root user
USER hono

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["node", "/app/dist/index.js"]