/**
 * Get Health use case
 * Pure business logic for retrieving health status
 */

import type { Health } from "@/entities/health";
import { VERSION } from "@/version";

export function getHealth(): Health {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: VERSION,
  };
}
