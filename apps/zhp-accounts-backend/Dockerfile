FROM node:24-alpine AS base
# Install pnpm globally
RUN npm install -g pnpm@10.28

# Build stage
FROM base AS builder

WORKDIR /build/zhp-accounts-backend

# Copy package files
COPY zhp-accounts-backend/package.json zhp-accounts-backend/pnpm-lock.yaml ./
COPY zhp-accounts-types /build/zhp-accounts-types

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY zhp-accounts-backend .

# Build TypeScript
RUN pnpm run build

# Test stage
FROM builder AS tester

WORKDIR /build/zhp-accounts-backend

ENV NODE_ENV=test

# Run tests
RUN pnpm test --run

# Production stage
FROM base AS production

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY zhp-accounts-backend/package.json zhp-accounts-backend/pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --production

# Copy built application from builder stage
COPY --from=builder /build/zhp-accounts-backend/dist ./dist

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/healthcheck', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Default environment
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
