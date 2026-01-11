/**
 * Example unit test structure
 * Remove this file and add real tests for your use cases
 */

import { describe, it, expect } from "vitest";
import { getHealth } from "@/use-cases/health/get-health";

describe("Health Use Case", (): void => {
  it("should return ok status", (): void => {
    const health = getHealth();
    expect(health.status).toBe("ok");
  });

  it("should include timestamp in ISO format", (): void => {
    const health = getHealth();
    expect(new Date(health.timestamp).getTime()).toBeGreaterThan(0);
  });

  it("should include version", (): void => {
    const health = getHealth();
    expect(health.version).toBe(process.env.EXPECTED_VERSION);
    expect(health.version).toBeTypeOf("string");
    expect(health.version).not.toBe("");
  });
});
