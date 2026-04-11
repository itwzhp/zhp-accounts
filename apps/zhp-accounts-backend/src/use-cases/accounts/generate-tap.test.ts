import { afterEach, describe, expect, it, vi } from "vitest";
import type { Account } from "zhp-accounts-types";
import { generateTap } from "@/use-cases/accounts/generate-tap";
import * as serviceProvider from "@/frameworks/providers/service-provider";
import type { HealthCheckPort } from "@/ports/health-check-port";

const ACTOR: Account = {
  id: "actor-1",
  upn: "admin@zhp.pl",
  membershipNumber: "AA000001",
};

function createCheck(name: string, status: "ok" | "degraded" | "down"): HealthCheckPort {
  return {
    name,
    check: async () => status,
  };
}

describe("generateTap", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws before command execution when full healthcheck is down", async () => {
    const generateTapCommand = vi.fn();

    vi.spyOn(serviceProvider, "getHealthChecks").mockReturnValue([
      createCheck("tipi", "ok"),
      createCheck("entra", "down"),
    ]);

    vi.spyOn(serviceProvider, "getEntraMemberDetailsPort").mockReturnValue({
      getMemberDetails: vi.fn(),
    });

    vi.spyOn(serviceProvider, "getEntraAccountCommandsPort").mockReturnValue({
      createAccount: vi.fn(),
      generateTap: generateTapCommand,
    });

    vi.spyOn(serviceProvider, "getMailNotificationPort").mockReturnValue({
      notifyAboutCreatedAccount: vi.fn(),
      notifyAboutGeneratedTap: vi.fn(),
    });

    vi.spyOn(serviceProvider, "getAuditLoggerPort").mockReturnValue({
      log: vi.fn(),
    });

    await expect(
      generateTap({ membershipNumber: "AA001234" }, ACTOR),
    ).rejects.toThrow("Pelny healthcheck nie przeszedl");

    expect(generateTapCommand).not.toHaveBeenCalled();
  });
});