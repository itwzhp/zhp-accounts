/**
 * Environment configuration management
 * All environment-specific parameters are read from environment variables
 */

interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
  logLevel: "debug" | "info" | "warn" | "error";
  enableCors: boolean;
  corsAllowedOrigins: string[];
}

function getConfig(): Config {
  const port = parseInt(process.env.PORT || "3000", 10);
  const nodeEnv = (process.env.NODE_ENV || "development") as
    | "development"
    | "production"
    | "test";
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

  return {
    port,
    nodeEnv,
    logLevel,
    enableCors,
    corsAllowedOrigins,
  };
}

export const config = getConfig();
