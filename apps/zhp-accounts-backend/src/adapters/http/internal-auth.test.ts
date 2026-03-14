import { describe, expect, it, vi } from "vitest";
import { generateInternalAuthToken, verifyInternalAuthToken } from "./internal-auth";

function buildRequestWithInternalAuth(token: string): { headers: Record<string, string> } {
  return {
    headers: {
      "x-internalauth": token,
    },
  };
}

const mockConfig = vi.hoisted(() => ({
  internalAuthJwtSecret: "test-secret",
  internalAuthJwtTtlSeconds: 60,
}));

vi.mock("@/config", () => ({ config: mockConfig }));

describe("internal auth token", (): void => {
  it("generates and verifies token payload", async (): Promise<void> => {
    const token = await generateInternalAuthToken({
      sub: "AA001234",
      allowedUnitIds: [3, 4],
      allowedMemberNumbers: ["AA001234", "AA005678"],
    });

    const payload = await verifyInternalAuthToken(buildRequestWithInternalAuth(token) as any);

    expect(payload).toMatchObject({
      sub: "AA001234",
      allowedUnitIds: [3, 4],
      allowedMemberNumbers: ["AA001234", "AA005678"],
    });
  });

  it("rejects invalid token", async (): Promise<void> => {
    const token = await generateInternalAuthToken({
      sub: "AA001234",
      allowedUnitIds: [3],
      allowedMemberNumbers: ["AA001234"],
    });

    const invalidToken = token.slice(0, -2) + "xx";

    const payload = await verifyInternalAuthToken(
      buildRequestWithInternalAuth(invalidToken) as any,
    );

    expect(payload).toBeNull();
  });

  it("rejects expired token", async (): Promise<void> => {
    const nowSpy = vi.spyOn(Date, "now");
    const issuedAtMs = 1_700_000_000_000;

    try {
      nowSpy.mockReturnValue(issuedAtMs);

      const token = await generateInternalAuthToken({
        sub: "AA001234",
        allowedUnitIds: [3],
        allowedMemberNumbers: ["AA001234"],
      });

      nowSpy.mockReturnValue(issuedAtMs + (mockConfig.internalAuthJwtTtlSeconds + 1) * 1000);

      const payload = await verifyInternalAuthToken(buildRequestWithInternalAuth(token) as any);

      expect(payload).toBeNull();
    } finally {
      nowSpy.mockRestore();
    }
  });
});