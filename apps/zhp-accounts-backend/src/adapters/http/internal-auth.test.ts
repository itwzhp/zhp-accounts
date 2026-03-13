import { describe, expect, it } from "vitest";
import { generateInternalAuthToken, verifyInternalAuthToken } from "@/adapters/http/internal-auth";

describe("internal auth token", (): void => {
  it("generates and verifies token payload", async (): Promise<void> => {
    const token = await generateInternalAuthToken(
      {
        sub: "AA001234",
        allowedUnitIds: [3, 4],
        allowedMemberNumbers: ["AA001234", "AA005678"],
      },
      {
        secret: "test-secret",
        ttlSeconds: 60,
      },
    );

    const payload = await verifyInternalAuthToken(token, "test-secret");

    expect(payload).toMatchObject({
      sub: "AA001234",
      allowedUnitIds: [3, 4],
      allowedMemberNumbers: ["AA001234", "AA005678"],
    });
  });

  it("rejects token verified with wrong secret", async (): Promise<void> => {
    const token = await generateInternalAuthToken(
      {
        sub: "AA001234",
        allowedUnitIds: [3],
        allowedMemberNumbers: ["AA001234"],
      },
      {
        secret: "test-secret",
        ttlSeconds: 60,
      },
    );

    const payload = await verifyInternalAuthToken(token, "other-secret");

    expect(payload).toBeNull();
  });
});