FROM node:24-alpine AS base
# Install pnpm globally
RUN npm install -g pnpm@10.33.0

# Build stage
FROM base AS builder

# Build argument for version
ARG VERSION=1.0.0-dev

WORKDIR /build/zhp-accounts-backend

# Copy package files
COPY zhp-accounts-backend/package.json zhp-accounts-backend/pnpm-lock.yaml zhp-accounts-backend/pnpm-workspace.yaml zhp-accounts-backend/.npmrc ./
COPY zhp-accounts-types /build/zhp-accounts-types

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY zhp-accounts-backend .

# Inject version into source code
RUN echo "export const VERSION = '${VERSION}';" > src/version.ts

# Build TypeScript
RUN pnpm run build

# Test stage
FROM builder AS tester

WORKDIR /build/zhp-accounts-backend

ENV NODE_ENV=test
ENV EXPECTED_VERSION=${VERSION}

# Run tests
RUN pnpm test --run

# Deploy stage
FROM builder AS deploy

WORKDIR /build/zhp-accounts-backend

RUN pnpm --filter . deploy --prod /out

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy runtime package manifest and production dependencies from deploy stage
COPY --from=deploy --chown=nodejs:nodejs /out/package.json ./package.json
COPY --from=deploy --chown=nodejs:nodejs /out/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /build/zhp-accounts-backend/dist ./dist

# Switch to non-root user
USER nodejs

# Default environment
ENV NODE_ENV=production
ENV AUDIT_ENV_NAMESPACE=prod
ENV PORT=3000
ENV LOG_LEVEL=info

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
