import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CreateAccountResponse, GenerateTapResponse } from "zhp-accounts-types";

const {
  beginSendMock,
  pollMock,
  getOperationStateMock,
  EmailClientMock,
  getAzureTokenCredentialMock,
} = vi.hoisted(() => ({
  beginSendMock: vi.fn(),
  pollMock: vi.fn(),
  getOperationStateMock: vi.fn(),
  EmailClientMock: vi.fn(),
  getAzureTokenCredentialMock: vi.fn(),
}));

vi.mock("@azure/communication-email", () => ({
  EmailClient: EmailClientMock,
  KnownEmailSendStatus: {
    Succeeded: "Succeeded",
  },
}));

vi.mock("@/frameworks/providers/azure-token-credential-provider", () => ({
  getAzureTokenCredential: getAzureTokenCredentialMock,
}));

vi.mock("@/config", () => ({
  config: {
    nodeEnv: "development",
    mailFromAddress: "sender@zhp.pl",
    mailAcsEndpoint: "https://test-acs.eastus.communication.azure.com",
    mailAcsPollIntervalMs: 1234,
  },
}));

import { config } from "../../config";
import { AzureMailNotificationAdapter } from "./azure-mail-notification-adapter";

describe("AzureMailNotificationAdapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    config.nodeEnv = "development";

    getAzureTokenCredentialMock.mockReturnValue({
      getToken: vi.fn(),
    });

    pollMock.mockResolvedValue(undefined);
    getOperationStateMock.mockReturnValue({
      result: {
        id: "operation-id-1",
      },
    });

    beginSendMock.mockResolvedValue({
      poll: pollMock,
      getOperationState: getOperationStateMock,
    });

    EmailClientMock.mockImplementation(() => ({
      beginSend: beginSendMock,
    }));
  });

  it("sends created account email with [DEV] subject prefix and plaintext", async () => {
    const adapter = new AzureMailNotificationAdapter();
    const payload: CreateAccountResponse = {
      password: "P@ssw0rd!",
      account: {
        id: "1",
        upn: "jan.kowalski@zhp.pl",
        membershipNumber: "123456",
        isAdmin: false,
      },
    };

    await adapter.notifyAboutCreatedAccount("notify@zhp.pl", payload);

    expect(beginSendMock).toHaveBeenCalledOnce();
    const [message] = beginSendMock.mock.calls[0] as [
      { content: { subject: string; html?: string; plainText?: string }; senderAddress: string },
    ];

    expect(message.senderAddress).toBe("sender@zhp.pl");
    expect(message.content.subject).toBe("[DEV] Twoje haslo do konta Microsoft 365");
    expect(message.content.html).toContain("jan.kowalski@zhp.pl");
    expect(message.content.plainText).toContain("Haslo tymczasowe: P@ssw0rd!");
    expect(message.content.plainText).not.toContain("<strong>");
    expect(pollMock).toHaveBeenCalledOnce();
    expect(getOperationStateMock).toHaveBeenCalledOnce();
  });

  it("sends TAP email without env prefix in production", async () => {
    config.nodeEnv = "production";

    const adapter = new AzureMailNotificationAdapter();
    const payload: GenerateTapResponse = {
      tap: "ABCDEF",
      expiresAt: "2026-12-01T10:00:00.000Z",
    };

    await adapter.notifyAboutGeneratedTap("notify@zhp.pl", payload);

    const [message] = beginSendMock.mock.calls[0] as [
      { content: { subject: string; plainText?: string } },
    ];
    expect(message.content.subject).toBe("Twoj Temporary Access Pass (TAP)");
    expect(message.content.plainText).toContain("TAP: ABCDEF");
  });

  it("logs unknown operation id when send state does not contain result", async () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    getOperationStateMock.mockReturnValue({});

    const adapter = new AzureMailNotificationAdapter();

    await adapter.notifyAboutGeneratedTap("notify@zhp.pl", {
      tap: "ABCDEF",
      expiresAt: "2026-12-01T10:00:00.000Z",
    });

    const payload = infoSpy.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(payload.operationId).toBe("unknown");
  });
});
