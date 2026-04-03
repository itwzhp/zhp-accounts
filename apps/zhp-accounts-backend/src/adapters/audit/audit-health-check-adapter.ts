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
    if (config.mockAudit) {
      return "ok";
    }

    if (!supportsElasticHealthCheck(this.auditLogger)) {
      console.info("[Health][audit] Audit logger does not support checkElasticAuditHealth");
      return "down";
    }

    const isHealthy = await this.auditLogger.checkElasticAuditHealth();
    if (!isHealthy) {
      console.info("[Health][audit] Elastic health check returned unhealthy");
      return "down";
    }

    return "ok";
  }
}
