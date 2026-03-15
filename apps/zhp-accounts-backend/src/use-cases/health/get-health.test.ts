afterEach(() => {
  vi.restoreAllMocks();
});
import { describe, expect, it, vi } from "vitest";
import type { HealthCheckPort } from "@/ports/health-check-port";
import { getHealth } from "@/use-cases/health/get-health";
import * as serviceProvider from "@/frameworks/providers/service-provider";
import { VERSION } from "@/version";

function createCheck(name: string, status: "ok" | "degraded" | "down"): HealthCheckPort {
  return {
    name,
    check: async () => status,
  };
}

describe("getHealth", (): void => {
  it("returns ok when all checks are ok", async (): Promise<void> => {
    vi.spyOn(serviceProvider, "getHealthChecks").mockReturnValue([
      createCheck("tipi", "ok"),
      createCheck("entra", "ok"),
      createCheck("audit", "ok"),
    ]);

    const result = await getHealth();

    expect(result.status).toBe("ok");
    expect(result.version).toBe(VERSION);
    expect(typeof result.timestamp).toBe("string");
  });

  it("returns degraded when at least one check is degraded and none is down", async (): Promise<void> => {
    vi.spyOn(serviceProvider, "getHealthChecks").mockReturnValue([
      createCheck("tipi", "ok"),
      createCheck("entra", "degraded"),
      createCheck("audit", "ok"),
    ]);

    const result = await getHealth();

    expect(result.status).toBe("degraded");
  });

  it("returns down when at least one check is down", async (): Promise<void> => {
    vi.spyOn(serviceProvider, "getHealthChecks").mockReturnValue([
      createCheck("tipi", "ok"),
      createCheck("entra", "down"),
      createCheck("audit", "degraded"),
    ]);

    const result = await getHealth();

    expect(result.status).toBe("down");
  });

  it("treats check exception as down", async (): Promise<void> => {
    const failingCheck: HealthCheckPort = {
      name: "tipi",
      check: async () => {
        throw new Error("boom");
      },
    };

    vi.spyOn(serviceProvider, "getHealthChecks").mockReturnValue([
      failingCheck,
      createCheck("entra", "ok"),
      createCheck("audit", "ok"),
    ]);

    const result = await getHealth();

    expect(result.status).toBe("down");
  });
});
