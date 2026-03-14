# ZHP Accounts Backend

Node 24 LTS TypeScript backend API for ZHP Accounts system, running in Azure Container Services via Docker.

## Architecture

Hexagonal architecture (ports & adapters pattern) with clear separation of concerns:

- **Adapters**: HTTP routes, database drivers, external service integrations
- **Use Cases**: Pure business logic, independent of frameworks
- **Entities**: Domain models
- **Frameworks**: Express, database ORM setup

## Development

### Prerequisites

- Node 24+
- pnpm 9.15+
- Docker & Docker Compose (for containerized development)

### Setup

```bash
pnpm install
```

### Development Server

**Local development:**
```bash
pnpm run dev
```

The server runs on `http://localhost:3000`

### Endpoints

- `GET /` - API info
- `GET /healthcheck` - Health status (used by Azure Container Services)

### Testing

```bash
# Run all tests
pnpm run test

# Watch mode
pnpm run test:ui

# Coverage report
pnpm run test:coverage
```

### Linting

```bash
pnpm run lint
pnpm run lint:fix
```

## Docker

### Building

**Production image:**
```bash
docker build -t zhp-accounts-backend:latest .
```

### Running

**Production:**
```bash
docker run -p 3000:3000 -e NODE_ENV=production zhp-accounts-backend:latest
```

## Environment Variables

All environment-specific configuration is managed via environment variables:

- `PORT` (default: `3000`) - Server port
- `NODE_ENV` (default: `development`) - Environment: `development|production|test`
- `LOG_LEVEL` (default: `info`) - Log level: `debug|info|warn|error`

### Local EasyAuth simulation

Identity source is selected **only** by `NODE_ENV`:

- `development` and `test`: identity is read from `Authorization: Bearer <jwt>`
- `production`: identity is read from Azure EasyAuth headers (`x-ms-client-principal-*`)

In local mode, bearer token payload is decoded without signature validation (development-only behavior).

For Azure Container Services, set these in your container environment configuration or Azure Key Vault integration.

## Deployment

CI/CD pipeline automatically builds and pushes Docker image to Azure Container Registry when pushing to main branch.

See `.github/workflows/backend-docker.yml` for workflow details.

## Project Structure

```
src/
├── main.ts                           # Entry point
├── config.ts                         # Configuration management
├── adapters/                         # External interfaces
│   ├── http/
│       └── routes/
├── use-cases/                        # Business logic
├── entities/                         # Domain models
└── frameworks/                       # Framework integration
    └── express/
```
