import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AuditLog } from "../../ports/audit-logger-port";

const mockConfig = vi.hoisted(() => ({
  auditElasticEndpoint: "https://logs-es.zhp.pl",
  auditElasticRequestTimeoutMs: 100,
  auditElasticApiKey: "api-key",
  auditElasticUsername: null,
  auditElasticPassword: null,
  auditEnvironmentNamespace: "dev",
}));

vi.mock("@/config", () => ({ config: mockConfig }));

import { ElasticAuditLoggerAdapter } from "./elastic-audit-logger-adapter";

const auditEntry: AuditLog = {
  message: "Account created",
  eventType: "creation",
  action: "create-account",
  actor: {
    id: "actor-id",
    upn: "actor@zhp.net.pl",
    membershipNumber: "AL0001",
  },
  target: {
    id: "target-id",
    upn: "target@zhp.net.pl",
    membershipNumber: "AL0002",
  },
};

describe("ElasticAuditLoggerAdapter", (): void => {
  const originalFetch = globalThis.fetch;

  beforeEach((): void => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach((): void => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    globalThis.fetch = originalFetch;
  });

  it("retries transient statuses and succeeds", async (): Promise<void> => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("busy", { status: 503, statusText: "Service Unavailable" }))
      .mockResolvedValueOnce(new Response("busy", { status: 429, statusText: "Too Many Requests" }))
      .mockResolvedValueOnce(new Response("ok", { status: 201 }));
    globalThis.fetch = fetchMock;

    const adapter = new ElasticAuditLoggerAdapter();
    const result = adapter.log(auditEntry);

    await vi.runAllTimersAsync();
    await expect(result).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const firstUrl = String(fetchMock.mock.calls[0]?.[0]);
    const secondUrl = String(fetchMock.mock.calls[1]?.[0]);
    const thirdUrl = String(fetchMock.mock.calls[2]?.[0]);
    expect(firstUrl).toMatch(/_doc\//);
    expect(secondUrl).toBe(firstUrl);
    expect(thirdUrl).toBe(firstUrl);
  });

  it("treats HTTP 409 as a successful idempotent outcome", async (): Promise<void> => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response("already exists", { status: 409 }));
    globalThis.fetch = fetchMock;

    const adapter = new ElasticAuditLoggerAdapter();

    await expect(adapter.log(auditEntry)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails immediately on non-retryable HTTP status", async (): Promise<void> => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response("bad request", { status: 400 }));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    globalThis.fetch = fetchMock;

    const adapter = new ElasticAuditLoggerAdapter();

    await expect(adapter.log(auditEntry)).rejects.toThrow("Elastic request failed with HTTP 400");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const errorPayload = errorSpy.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(errorPayload.document).toBeDefined();
  });

  it("uses API key authorization header when configured", async (): Promise<void> => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response("ok", { status: 201 }));
    globalThis.fetch = fetchMock;

    const adapter = new ElasticAuditLoggerAdapter();

    await adapter.log(auditEntry);

    const firstCall = fetchMock.mock.calls[0];
    const requestInit = firstCall[1] as RequestInit;
    const headers = requestInit.headers as Record<string, string>;

    expect(headers.Authorization).toBe("ApiKey api-key");
  });

  it("returns true for health check when required role is present", async (): Promise<void> => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ roles: ["zhp-accounts-logs-writer"] }), { status: 200 }));
    globalThis.fetch = fetchMock;

    const adapter = new ElasticAuditLoggerAdapter();

    await expect(adapter.checkElasticAuditHealth()).resolves.toBe(true);
  });

  it("returns false for health check when required role is missing", async (): Promise<void> => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(JSON.stringify({ roles: ["different-role"] }), { status: 200 }));
    globalThis.fetch = fetchMock;

    const adapter = new ElasticAuditLoggerAdapter();

    await expect(adapter.checkElasticAuditHealth()).resolves.toBe(false);
  });
});
