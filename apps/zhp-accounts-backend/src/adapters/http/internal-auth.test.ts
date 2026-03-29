import { SignJWT } from "jose";
import { describe, expect, it, vi } from "vitest";
import { generateInternalAuthToken, verifyInternalAuthToken } from "./internal-auth";

function buildRequestWithInternalAuth(token: string): any {
  return {
    headers: {
      "x-internalauth": token,
    },
  };
}

const mockConfig = vi.hoisted(() => ({
  internalAuthJwtSecret: "test-secret",
  internalAuthJwtTtlSeconds: 60,
  internalAuthJwtAudience: "zhp-accounts-test",
}));

vi.mock("@/config", () => ({ config: mockConfig }));

describe("internal auth token", (): void => {
  it("generates and verifies token payload", async (): Promise<void> => {
    const token = await generateInternalAuthToken({
      sub: "AA001234",
      allowedUnitIds: [3, 4],
      allowedMemberNumbers: ["AA001234", "AA005678"],
    });

    const payload = await verifyInternalAuthToken(buildRequestWithInternalAuth(token));

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
      buildRequestWithInternalAuth(invalidToken),
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

      const payload = await verifyInternalAuthToken(buildRequestWithInternalAuth(token));

      expect(payload).toBeNull();
    } finally {
      nowSpy.mockRestore();
    }
  });

  it("rejects token with invalid audience", async (): Promise<void> => {
    const secretKey = new TextEncoder().encode(mockConfig.internalAuthJwtSecret);
    const issuedAt = Math.floor(Date.now() / 1000);

    const token = await new SignJWT({
      allowedUnitIds: [3],
      allowedMemberNumbers: ["AA001234"],
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject("AA001234")
      .setAudience("zhp-accounts-prod")
      .setIssuedAt(issuedAt)
      .setExpirationTime(issuedAt + mockConfig.internalAuthJwtTtlSeconds)
      .sign(secretKey);

    const payload = await verifyInternalAuthToken(buildRequestWithInternalAuth(token));

    expect(payload).toBeNull();
  });
});