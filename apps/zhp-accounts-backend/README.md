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
- `MOCK_AUDIT` (default: `false`) - Use mock audit logger when set to `true` (case-insensitive)
- `MOCK_ENTRA` (default: `false`) - Use mock Entra adapters when set to `true` (case-insensitive)
- `MOCK_TIPI` (default: `false`) - Use mock Tipi adapters when set to `true` (case-insensitive)
- `MOCK_MAIL` (default: `false`) - Use mock mail adapters when set to `true` (case-insensitive)
- `AUDIT_ENV_NAMESPACE` (default: `dev|test|prod` based on `NODE_ENV`) - ECS `data_stream.namespace`
- `AUDIT_ELASTIC_ENDPOINT` (required when `MOCK_AUDIT` is not `true`) - Elastic endpoint URL
- `AUDIT_ELASTIC_API_KEY` (preferred) - Elastic API key for audit writes
- `AUDIT_ELASTIC_USERNAME` and `AUDIT_ELASTIC_PASSWORD` (alternative) - Basic auth credentials
- `AUDIT_ELASTIC_REQUEST_TIMEOUT_MS` (default: `3000`) - Audit request timeout

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
