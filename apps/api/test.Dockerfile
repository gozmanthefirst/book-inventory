FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat libc6-compat

# Set up the application directory in the builder stage
WORKDIR /app

# Install pnpm and turbo
RUN npm install -g pnpm && \
    pnpm install turbo@^2.4.4 --global

COPY . .
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune api --docker

# Installer stage to install dependencies and build the application
FROM base AS installer

RUN apk add --no-cache gcompat wget libc6-compat

WORKDIR /app

# Copy the pruned lockfile and package.json from the builder stage
COPY --from=builder /app/out/json/ .

# First install the dependencies (as they change less often)
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy the required source files from the builder stage
COPY --from=builder /app/out/full/ .
    
# Build the project
RUN cd packages/database && \
    pnpm db:generate && \
    cd ../../ && \
    pnpm exec turbo run build

# Production stage with only essential files
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono

# Copy workspace files and dependencies
COPY --from=installer --chown=hono:nodejs /app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=installer --chown=hono:nodejs /app/packages ./packages
COPY --from=installer --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=installer --chown=hono:nodejs /app/apps/api/node_modules /app/apps/api/node_modules
COPY --from=installer --chown=hono:nodejs /app/apps/api/dist /app/apps/api/dist
COPY --from=installer --chown=hono:nodejs /app/package.json /app/package.json
COPY --from=installer --chown=hono:nodejs /app/apps/api/package.json /app/apps/api/package.json

# Set the environment variable
ENV NODE_ENV=production \
    HOSTNAME="0.0.0.0" \
    PORT=8000

# Use non-root user
USER hono

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["node", "apps/api/dist/index.js"]