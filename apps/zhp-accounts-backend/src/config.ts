/**
 * Environment configuration management
 * All environment-specific parameters are read from environment variables
 */

interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
  isLocalInstance: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
  mockAudit: boolean;
  mockEntra: boolean;
  mockTipi: boolean;
  mockMail: boolean;
  enableCors: boolean;
  corsAllowedOrigins: string[];
  internalAuthJwtSecret: string;
  internalAuthJwtTtlSeconds: number;
  internalAuthJwtAudience: string;
  auditEnvironmentNamespace: string;
  auditElasticEndpoint: string | null;
  auditElasticApiKey: string | null;
  auditElasticUsername: string | null;
  auditElasticPassword: string | null;
  auditElasticRequestTimeoutMs: number;
  entraTenantId: string;
  entraClientId: string;
  entraLicenseSku: string;
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

function parseBooleanFlag(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

function nullable(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function mapNodeEnvToAuditNamespace(nodeEnv: "development" | "production" | "test"): string {
  if (nodeEnv === "development") {
    return "dev";
  }

  if (nodeEnv === "production") {
    return "prod";
  }

  return "test";
}

function getConfig(): Config {
  const defaultEntraTenantId = "e1368d1e-3975-4ce6-893d-fc351fd44dcd";
  const defaultEntraClientId = "87387abe-3db2-4d76-b115-bfe7f23f6553";
  const defaultEntraLicenseSku = "94763226-9b3c-4e75-a931-5c89701abe66";

  const port = parseInt(process.env.PORT || "3000", 10);
  const nodeEnv = parseNodeEnv(process.env.NODE_ENV);
  const isLocalInstance = nodeEnv === "development";
  const logLevel = (process.env.LOG_LEVEL || "info") as
    | "debug"
    | "info"
    | "warn"
    | "error";
  const mockAudit = parseBooleanFlag(process.env.MOCK_AUDIT);
  const mockEntra = parseBooleanFlag(process.env.MOCK_ENTRA);
  const mockTipi = parseBooleanFlag(process.env.MOCK_TIPI);
  const mockMail = parseBooleanFlag(process.env.MOCK_MAIL);
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

  const auditEnvironmentNamespace = mapNodeEnvToAuditNamespace(nodeEnv);
  const auditElasticEndpoint = nullable(process.env.AUDIT_ELASTIC_ENDPOINT);
  const auditElasticApiKey = nullable(process.env.AUDIT_ELASTIC_API_KEY);
  const auditElasticUsername = nullable(process.env.AUDIT_ELASTIC_USERNAME);
  const auditElasticPassword = nullable(process.env.AUDIT_ELASTIC_PASSWORD);
  const internalAuthJwtAudience = `zhp-accounts-${auditEnvironmentNamespace}`;
  const auditElasticRequestTimeoutMs = Number.parseInt(
    process.env.AUDIT_ELASTIC_REQUEST_TIMEOUT_MS || "3000",
    10,
  );
  const entraTenantId = process.env.ENTRA_TENANT_ID?.trim() || defaultEntraTenantId;
  const entraClientId = process.env.ENTRA_CLIENT_ID?.trim() || defaultEntraClientId;
  const entraLicenseSku = process.env.ENTRA_LICENSE_SKU?.trim() || defaultEntraLicenseSku;

  if (!mockAudit) {
    if (!auditElasticEndpoint) {
      throw new Error("AUDIT_ELASTIC_ENDPOINT is required when MOCK_AUDIT is not true");
    }

    const hasApiKey = Boolean(auditElasticApiKey);
    const hasBasicAuth = Boolean(auditElasticUsername) && Boolean(auditElasticPassword);

    if (!hasApiKey && !hasBasicAuth) {
      throw new Error(
        "MOCK_AUDIT=false requires AUDIT_ELASTIC_API_KEY or AUDIT_ELASTIC_USERNAME + AUDIT_ELASTIC_PASSWORD",
      );
    }
  }

  return {
    port,
    nodeEnv,
    isLocalInstance,
    logLevel,
    mockAudit,
    mockEntra,
    mockTipi,
    mockMail,
    enableCors,
    corsAllowedOrigins,
    internalAuthJwtSecret,
    internalAuthJwtTtlSeconds,
    internalAuthJwtAudience,
    auditEnvironmentNamespace,
    auditElasticEndpoint,
    auditElasticApiKey,
    auditElasticUsername,
    auditElasticPassword,
    auditElasticRequestTimeoutMs,
    entraTenantId,
    entraClientId,
    entraLicenseSku,
  };
}

export const config = getConfig();
