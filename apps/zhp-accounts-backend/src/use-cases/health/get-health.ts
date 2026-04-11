/**
 * Get Health use case
 * Pure business logic for retrieving health status
 */

import type { Health } from "@/entities/health";
import type { HealthStatus } from "@/entities/health";
import type { HealthCheckPort } from "@/ports/health-check-port";
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

async function runHealthCheck(
  check: HealthCheckPort,
): Promise<HealthStatus> {
  try {
    const status = await check.check();

    if (status === "down") {
      console.error(`[Health] Check "${check.name}" returned down`);
    }

    if (status === "degraded") {
      console.warn(`[Health] Check "${check.name}" returned degraded`);
    }

    return status;
  } catch (error) {
    console.error(
      `[Health] Check "${check.name}" failed: ${getErrorMessage(error)}`,
    );

    return "down";
  }
}

export async function getHealthFromChecks(
  checks: HealthCheckPort[],
): Promise<Health> {
  let worstStatus: HealthStatus = "ok";

  const statuses = await Promise.all(checks.map((check) => runHealthCheck(check)));

  for (const status of statuses) {
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

export async function getHealth(): Promise<Health> {
  return getHealthFromChecks(getHealthChecks());
}
