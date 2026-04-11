FROM node:24-alpine AS builder
# Install pnpm globally
RUN npm install -g pnpm@10.33.0

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

# Build bundled runtime
RUN pnpm run build

# Test stage
FROM builder AS tester

WORKDIR /build/zhp-accounts-backend

ENV NODE_ENV=test
ENV EXPECTED_VERSION=${VERSION}

# Run tests
RUN pnpm test --run

# Smoke check bundled artifact syntax
RUN node --check dist/main.cjs

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application from tester stage to enforce test/smoke gate
COPY --from=tester --chown=nodejs:nodejs /build/zhp-accounts-backend/dist ./dist

# Switch to non-root user
USER nodejs

# Default environment
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.cjs"]
