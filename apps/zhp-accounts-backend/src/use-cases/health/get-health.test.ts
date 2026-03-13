/**
 * Example unit test structure
 * Remove this file and add real tests for your use cases
 */

import { describe, it, expect } from "vitest";
import { getHealth } from "@/use-cases/health/get-health";
import { VERSION } from "@/version";

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
    expect(health.version).toBe(VERSION);
    expect(health.version).toBeTypeOf("string");
    expect(health.version).not.toBe("");
  });
});
