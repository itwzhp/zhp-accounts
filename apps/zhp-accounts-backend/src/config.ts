/**
 * Environment configuration management
 * All environment-specific parameters are read from environment variables
 */

interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
  isLocalInstance: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  enableCors: boolean;
  corsAllowedOrigins: string[];
  internalAuthJwtSecret: string;
  internalAuthJwtTtlSeconds: number;
  auditLoggerMode: "console" | "elastic";
  auditEnvironmentNamespace: string;
  auditElasticEndpoint: string | null;
  auditElasticApiKey: string | null;
  auditElasticUsername: string | null;
  auditElasticPassword: string | null;
  auditElasticRequestTimeoutMs: number;
}

function parseNodeEnv(
  nodeEnv: string | undefined,
): "development" | "production" | "test" {
  if (nodeEnv === undefined || nodeEnv.length === 0) {
    return "development";
  }

  if (nodeEnv === "development" || nodeEnv === "production" || nodeEnv === "test") {
    return nodeEnv;
  }

  throw new Error(
    `Unsupported NODE_ENV value: ${nodeEnv}. Expected one of: development, production, test.`,
  );
}

function parseAuditLoggerMode(mode: string | undefined, fallback: "console" | "elastic"): "console" | "elastic" {
  if (!mode) {
    return fallback;
  }

  if (mode === "console" || mode === "elastic") {
    return mode;
  }

  throw new Error(`Unsupported AUDIT_LOGGER_MODE value: ${mode}. Expected one of: console, elastic.`);
}

function nullable(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function getConfig(): Config {
  const port = parseInt(process.env.PORT || "3000", 10);
  const nodeEnv = parseNodeEnv(process.env.NODE_ENV);
  const isLocalInstance = nodeEnv !== "production";
  const logLevel = (process.env.LOG_LEVEL || "info") as
    | "debug"
    | "info"
    | "warn"
    | "error";
  const enableCors = process.env.ENABLE_CORS
    ? process.env.ENABLE_CORS === "true"
    : nodeEnv === "development";
  const corsAllowedOrigins = (
    process.env.CORS_ALLOWED_ORIGINS ||
    "http://localhost:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const internalAuthJwtSecretEnv = process.env.INTERNAL_AUTH_JWT_SECRET;
  if (!internalAuthJwtSecretEnv && nodeEnv === "production") {
    throw new Error("INTERNAL_AUTH_JWT_SECRET is required in production");
  }
  const internalAuthJwtSecret = internalAuthJwtSecretEnv || "zhp-accounts-internal-auth-dev-secret";
  const internalAuthJwtTtlSeconds = Number.parseInt(
    process.env.INTERNAL_AUTH_JWT_TTL_SECONDS || "1800",
    10,
  );

  const auditLoggerMode = parseAuditLoggerMode(
    process.env.AUDIT_LOGGER_MODE,
    nodeEnv === "production" ? "elastic" : "console",
  );
  const auditEnvironmentNamespace = process.env.AUDIT_ENV_NAMESPACE ||
    (nodeEnv === "production" ? "prod" : nodeEnv === "test" ? "test" : "dev");
  const auditElasticEndpoint = nullable(process.env.AUDIT_ELASTIC_ENDPOINT);
  const auditElasticApiKey = nullable(process.env.AUDIT_ELASTIC_API_KEY);
  const auditElasticUsername = nullable(process.env.AUDIT_ELASTIC_USERNAME);
  const auditElasticPassword = nullable(process.env.AUDIT_ELASTIC_PASSWORD);
  const auditElasticRequestTimeoutMs = Number.parseInt(
    process.env.AUDIT_ELASTIC_REQUEST_TIMEOUT_MS || "3000",
    10,
  );

  if (auditLoggerMode === "elastic") {
    if (!auditElasticEndpoint) {
      throw new Error("AUDIT_ELASTIC_ENDPOINT is required when AUDIT_LOGGER_MODE=elastic");
    }

    const hasApiKey = Boolean(auditElasticApiKey);
    const hasBasicAuth = Boolean(auditElasticUsername) && Boolean(auditElasticPassword);

    if (!hasApiKey && !hasBasicAuth) {
      throw new Error(
        "AUDIT_LOGGER_MODE=elastic requires AUDIT_ELASTIC_API_KEY or AUDIT_ELASTIC_USERNAME + AUDIT_ELASTIC_PASSWORD",
      );
    }
  }

  return {
    port,
    nodeEnv,
    isLocalInstance,
    logLevel,
    enableCors,
    corsAllowedOrigins,
    internalAuthJwtSecret,
    internalAuthJwtTtlSeconds,
    auditLoggerMode,
    auditEnvironmentNamespace,
    auditElasticEndpoint,
    auditElasticApiKey,
    auditElasticUsername,
    auditElasticPassword,
    auditElasticRequestTimeoutMs,
  };
}

export const config = getConfig();
