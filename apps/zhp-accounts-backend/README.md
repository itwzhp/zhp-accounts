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

**With Docker Compose:**
```bash
docker-compose up
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
pnpm run test

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

**Development image (with hot-reload):**
```bash
docker build -f Dockerfile.dev -t zhp-accounts-backend:dev .
```

### Running

**Production:**
```bash
docker run -p 3000:3000 -e NODE_ENV=production zhp-accounts-backend:latest
```

**Development:**
```bash
docker-compose up
```

## Environment Variables

All environment-specific configuration is managed via environment variables:

- `PORT` (default: `3000`) - Server port
- `NODE_ENV` (default: `development`) - Environment: `development|production|test`
- `LOG_LEVEL` (default: `info`) - Log level: `debug|info|warn|error`

For Azure Container Services, set these in your container environment configuration or Azure Key Vault integration.

## Deployment

CI/CD pipeline automatically builds and pushes Docker image to Azure Container Registry when pushing to main branch.

### GitHub Secrets Required

- `ACR_ENDPOINT` - Azure Container Registry endpoint (e.g., `myregistry.azurecr.io`)
- `ACR_USERNAME` - ACR username
- `ACR_PASSWORD` - ACR password or token

See `.github/workflows/backend-docker.yml` for workflow details.

## Project Structure

```
src/
├── main.ts                           # Entry point
├── config.ts                         # Configuration management
├── adapters/                         # External interfaces
│   ├── http/
│   │   ├── index.ts
│   │   └── routes/
│   └── database/                     # (Placeholder for DB adapter)
├── use-cases/                        # Business logic
│   └── health/
├── entities/                         # Domain models
└── frameworks/                       # Framework integration
    └── express/
        └── app.ts
```
