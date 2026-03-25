import { Client, type ClientOptions } from "@elastic/elasticsearch";
import { config } from "@/config";
import type { AuditLog, AuditLoggerPort } from "@/ports/audit-logger-port";

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

function buildClientOptions(): ClientOptions {
    if (!config.auditElasticEndpoint) {
        throw new Error("AUDIT_ELASTIC_ENDPOINT is required for elastic audit logger mode");
    }

    const options: ClientOptions = {
        node: config.auditElasticEndpoint,
        requestTimeout: config.auditElasticRequestTimeoutMs
    };

    if (config.auditElasticApiKey) {
        options.auth = { apiKey: config.auditElasticApiKey };

        return options;
    }

    if (config.auditElasticUsername && config.auditElasticPassword) {
        options.auth = {
            username: config.auditElasticUsername,
            password: config.auditElasticPassword,
        };

        return options;
    }

    throw new Error(
        "Elastic audit logger requires authentication via AUDIT_ELASTIC_API_KEY or AUDIT_ELASTIC_USERNAME/AUDIT_ELASTIC_PASSWORD",
    );
}

function assertRequiredString(value: string, fieldName: string): string {
    if (value.trim().length === 0) {
        throw new Error(`Audit log requires field '${fieldName}'`);
    }

    return value;
}

function buildAuditDocument(entry: AuditLog): ElasticAuditDocument {
    const actorId = assertRequiredString(entry.actor.id, "actor.id");
    const actorName = assertRequiredString(entry.actor.upn, "actor.upn");
    const actorMemberNumber = assertRequiredString(entry.actor.membershipNumber, "actor.membershipNumber");
    const targetId = assertRequiredString(entry.target.id, "target.id");
    const targetName = assertRequiredString(entry.target.upn, "target.upn");
    const targetMemberNumber = assertRequiredString(entry.target.membershipNumber, "target.membershipNumber");

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
        "ZHP.Actor.MemberNumber": actorMemberNumber,
        "ZHP.Target.MemberNumber": targetMemberNumber,
        "related.user": relatedUsers,
        ...(entry.authentication?.validUntil
            ? { "Authentication.ValidUntil": entry.authentication.validUntil }
            : {}),
    };
}

export class ElasticAuditLoggerAdapter implements AuditLoggerPort {
    private readonly client = new Client(buildClientOptions());

    async log(entry: AuditLog): Promise<void> {
        const document = buildAuditDocument(entry);

        await this.client.index({
            index: `logs-zhp.accounts-${config.auditEnvironmentNamespace}`,
            document,
        });
    }

    async checkElasticAuditHealth(): Promise<boolean> {
        return this.client.ping();
    }
}

