import type { HealthStatus } from "@/entities/health";
import type { HealthCheckPort } from "@/ports/health-check-port";

export class AuditHealthCheckAdapter implements HealthCheckPort {
  name = "audit";

  async check(): Promise<HealthStatus> {
    return "ok";
  }
}
