import { config } from "@/config";
import type { HealthStatus } from "@/entities/health";
import type { HealthCheckPort } from "@/ports/health-check-port";
import type { AuditLoggerPort } from "@/ports/audit-logger-port";

interface ElasticHealthCheckCapable {
  checkElasticAuditHealth(): Promise<boolean>;
}

function supportsElasticHealthCheck(value: AuditLoggerPort): value is AuditLoggerPort & ElasticHealthCheckCapable {
  return "checkElasticAuditHealth" in value && typeof value.checkElasticAuditHealth === "function";
}

export class AuditHealthCheckAdapter implements HealthCheckPort {
  name = "audit";

  constructor(private readonly auditLogger: AuditLoggerPort) {}

  async check(): Promise<HealthStatus> {
    if (config.auditLoggerMode !== "elastic") {
      return "ok";
    }

    if (!supportsElasticHealthCheck(this.auditLogger)) {
      return "down";
    }

    try {
      const isHealthy = await this.auditLogger.checkElasticAuditHealth();
      return isHealthy ? "ok" : "down";
    } catch {
      return "down";
    }
  }
}
