import { afterEach, describe, expect, it, vi } from "vitest";
import type { HealthCheckPort } from "@/ports/health-check-port";
import { getReadinessHealth } from "@/use-cases/health/get-readiness-health";
import * as serviceProvider from "@/frameworks/providers/service-provider";

function createCheck(name: string, status: "ok" | "degraded" | "down"): HealthCheckPort {
  return {
    name,
    check: async () => status,
  };
}

describe("getReadinessHealth", (): void => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns ok when readiness checks are ok", async (): Promise<void> => {
    vi.spyOn(serviceProvider, "getReadinessChecks").mockReturnValue([
      createCheck("tipi", "ok"),
    ]);

    const result = await getReadinessHealth();

    expect(result.status).toBe("ok");
  });

  it("returns down when readiness check fails", async (): Promise<void> => {
    vi.spyOn(serviceProvider, "getReadinessChecks").mockReturnValue([
      createCheck("tipi", "down"),
    ]);

    const result = await getReadinessHealth();

    expect(result.status).toBe("down");
  });
});