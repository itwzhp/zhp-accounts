/**
 * Environment configuration management
 * All environment-specific parameters are read from environment variables
 */

interface Config {
  port: number;
  nodeEnv: "development" | "production" | "test";
  logLevel: "debug" | "info" | "warn" | "error";
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

  return {
    port,
    nodeEnv,
    logLevel,
  };
}

export const config = getConfig();
