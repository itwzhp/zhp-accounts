/**
 * Health entity
 * Domain model for health check response
 */

export interface Health {
  status: "ok" | "degraded" | "down";
  timestamp: string;
  version: string;
}
