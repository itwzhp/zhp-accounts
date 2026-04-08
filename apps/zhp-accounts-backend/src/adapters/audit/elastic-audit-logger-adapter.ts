import { config } from "@/config";
import type { AuditLog, AuditLoggerPort } from "@/ports/audit-logger-port";

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504, 520, 521, 522, 523, 524, 525, 526]);
const RETRY_DELAYS_MS = [200, 400, 800, 1600, 3200] as const;
const JITTER_MAX_MS = 100;

interface ElasticAuditDocument {
    "@timestamp": string;
    message: string;
    "log.level": "info" | "warning" | "error";
    "event.kind": "event";
    "event.category": "iam";
    "event.type": "creation" | "change";
    "event.action": string;
    "event.outcome": "success" | "failure";
    "data_stream.type": "logs";
    "data_stream.dataset": "zhp.accounts";
    "data_stream.namespace": string;
    "user.id": string;
    "user.name": string;
    "target.user.id": string;
    "target.user.name": string;
    "ZHP.Actor.MemberNumber": string;
    "ZHP.Target.MemberNumber": string;
    "related.user": string[];
    "Authentication.ValidUntil"?: string;
}

class ElasticHttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly bodySnippet?: string,
    ) {
        super(`Elastic request failed with HTTP ${status} ${statusText}`);
    }
}

class ElasticRequestTimeoutError extends Error {
    public readonly reason: unknown;

    constructor(public readonly timeoutMs: number, cause: unknown) {
        super(`Elastic request timed out after ${timeoutMs}ms`);
        this.reason = cause;
    }
}

function getAuditElasticEndpoint(): string {
    if (!config.auditElasticEndpoint) {
        throw new Error("AUDIT_ELASTIC_ENDPOINT is required for elastic audit logger mode");
    }

    return config.auditElasticEndpoint.endsWith("/")
        ? config.auditElasticEndpoint
        : `${config.auditElasticEndpoint}/`;
}

function buildAuthorizationHeader(): string {
    if (config.auditElasticApiKey) {
        return `ApiKey ${config.auditElasticApiKey}`;
    }

    if (config.auditElasticUsername && config.auditElasticPassword) {
        const credentials = Buffer
            .from(`${config.auditElasticUsername}:${config.auditElasticPassword}`, "utf8")
            .toString("base64");

        return `Basic ${credentials}`;
    }

    throw new Error(
        "Elastic audit logger requires authentication via AUDIT_ELASTIC_API_KEY or AUDIT_ELASTIC_USERNAME/AUDIT_ELASTIC_PASSWORD",
    );
}

function buildElasticUrl(path: string): string {
    return new URL(path, getAuditElasticEndpoint()).toString();
}

function buildCommonHeaders(): Record<string, string> {
    return {
        Authorization: buildAuthorizationHeader(),
        Accept: "application/json",
    };
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, {
            ...init,
            signal: controller.signal,
        });
    } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
            throw new ElasticRequestTimeoutError(timeoutMs, error);
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

function calculateRetryDelayMs(attempt: number): number {
    const baseDelay = RETRY_DELAYS_MS[attempt - 1] ?? RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
    const jitter = Math.floor(Math.random() * JITTER_MAX_MS);

    return baseDelay + jitter;
}

async function waitFor(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableTransportError(error: unknown): boolean {
    if (error instanceof ElasticRequestTimeoutError) {
        return true;
    }

    return error instanceof TypeError;
}

function shouldRetryStatus(status: number): boolean {
    return RETRYABLE_STATUS_CODES.has(status);
}

async function readBodySnippet(response: Response): Promise<string | undefined> {
    const body = await response.text();
    const trimmed = body.trim();

    if (trimmed.length === 0) {
        return undefined;
    }

    return trimmed.slice(0, 300);
}

function buildAuditDocument(entry: AuditLog): ElasticAuditDocument {
    const actorId = entry.actor.id;
    const actorName = entry.actor.upn;
    const targetId = entry.target.id;
    const targetName = entry.target.upn;

    const relatedUsers = [actorId, actorName, targetId, targetName];

    return {
        "@timestamp": new Date().toISOString(),
        message: entry.message,
        "log.level": entry.level ?? "info",
        "event.kind": "event",
        "event.category": "iam",
        "event.type": entry.eventType,
        "event.action": entry.action,
        "event.outcome": entry.outcome ?? "success",
        "data_stream.type": "logs",
        "data_stream.dataset": "zhp.accounts",
        "data_stream.namespace": config.auditEnvironmentNamespace,
        "user.id": actorId,
        "user.name": actorName,
        "target.user.id": targetId,
        "target.user.name": targetName,
        "ZHP.Actor.MemberNumber": entry.actor.membershipNumber,
        "ZHP.Target.MemberNumber": entry.target.membershipNumber,
        "related.user": relatedUsers,
        ...(entry.authentication?.validUntil
            ? { "Authentication.ValidUntil": entry.authentication.validUntil }
            : {}),
    };
}

export class ElasticAuditLoggerAdapter implements AuditLoggerPort {
    private readonly indexName = `logs-zhp.accounts-${config.auditEnvironmentNamespace}`;
    private readonly timeoutMs = config.auditElasticRequestTimeoutMs;
    private readonly maxAttempts = RETRY_DELAYS_MS.length + 1;

    async log(entry: AuditLog): Promise<void> {
        const document = buildAuditDocument(entry);
        const documentId = crypto.randomUUID();
        const url = buildElasticUrl(`${this.indexName}/_create/${encodeURIComponent(documentId)}`);

        for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
            let response: Response;
            try {
                response = await fetchWithTimeout(
                    url,
                    {
                        method: "POST",
                        headers: {
                            ...buildCommonHeaders(),
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(document),
                    },
                    this.timeoutMs,
                );
            } catch (error) {
                if (isRetryableTransportError(error) && attempt < this.maxAttempts) {
                    await waitFor(calculateRetryDelayMs(attempt));
                    continue;
                }

                console.error("[Audit][elastic] Failed to push audit log", {
                    error: error instanceof Error ? error.message : String(error),
                    documentId,
                    document,
                });
                throw error;
            }

            if (response.ok || response.status === 409) {
                return;
            }

            const error = new ElasticHttpError(
                response.status,
                response.statusText,
                await readBodySnippet(response),
            );

            if (shouldRetryStatus(response.status) && attempt < this.maxAttempts) {
                await waitFor(calculateRetryDelayMs(attempt));
                continue;
            }

            console.error("[Audit][elastic] Failed to push audit log", {
                status: error.status,
                statusText: error.statusText,
                body: error.bodySnippet,
                documentId,
                document,
            });
            throw error;
        }

        throw new Error("[Audit][elastic] Failed to push audit log after exhausting retries");
    }

    async checkElasticAuditHealth(): Promise<boolean> {
        const url = buildElasticUrl("_security/_authenticate");

        const response = await fetchWithTimeout(
            url,
            {
                method: "GET",
                headers: buildCommonHeaders(),
            },
            this.timeoutMs,
        );

        if (!response.ok) {
            console.info(`[Health][audit] HTTP ${response.status} from elastic security authenticate`);
            return false;
        }

        const payload = await response.json() as { roles?: unknown };
        const roles = Array.isArray(payload.roles)
            ? payload.roles.filter((role): role is string => typeof role === "string")
            : [];
        const hasRequiredRole = roles.includes("zhp-accounts-logs-writer");

        if (!hasRequiredRole) {
            console.info("[Health][audit] Missing required role zhp-accounts-logs-writer");
        }

        return hasRequiredRole;
    }
}

