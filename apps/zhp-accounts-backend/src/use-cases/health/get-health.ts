/**
 * Get Health use case
 * Pure business logic for retrieving health status
 */

import type { Health } from "@/entities/health";
import type { HealthStatus } from "@/entities/health";
import { getHealthChecks } from "@/frameworks/providers/service-provider";
import { VERSION } from "@/version";

const STATUS_RANK: Record<HealthStatus, number> = {
  ok: 0,
  degraded: 1,
  down: 2,
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export async function getHealth(): Promise<Health> {
  let worstStatus: HealthStatus = "ok";

  for (const check of getHealthChecks()) {
    let status: HealthStatus;

    try {
      status = await check.check();

      if (status === "down") {
        console.error(`[Health] Check \"${check.name}\" returned down`);
      }

      if (status === "degraded") {
        console.warn(`[Health] Check \"${check.name}\" returned degraded`);
      }
    } catch (error) {
      status = "down";
      console.error(
        `[Health] Check \"${check.name}\" failed: ${getErrorMessage(error)}`,
      );
    }

    if (STATUS_RANK[status] > STATUS_RANK[worstStatus]) {
      worstStatus = status;
    }
  }

  return {
    status: worstStatus,
    timestamp: new Date().toISOString(),
    version: VERSION,
  };
}
