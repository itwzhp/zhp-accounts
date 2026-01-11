/**
 * Get Health use case
 * Pure business logic for retrieving health status
 */

import type { Health } from "@/entities/health";

export function getHealth(): Health {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0", // TODO return real version
  };
}
