/**
 * Health entity
 * Domain model for health check response
 */

export interface Health {
  status: HealthStatus;
  timestamp: string;
  version: string;
}

export type HealthStatus = "ok" | "degraded" | "down";
