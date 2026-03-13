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
  const internalAuthJwtSecret =
    process.env.INTERNAL_AUTH_JWT_SECRET || "zhp-accounts-internal-auth-dev-secret";
  const internalAuthJwtTtlSeconds = Number.parseInt(
    process.env.INTERNAL_AUTH_JWT_TTL_SECONDS || "1800",
    10,
  );

  return {
    port,
    nodeEnv,
    isLocalInstance,
    logLevel,
    enableCors,
    corsAllowedOrigins,
    internalAuthJwtSecret,
    internalAuthJwtTtlSeconds,
  };
}

export const config = getConfig();
