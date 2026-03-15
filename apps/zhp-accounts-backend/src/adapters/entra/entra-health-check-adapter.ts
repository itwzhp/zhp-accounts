import type { HealthStatus } from "@/entities/health";
import type { HealthCheckPort } from "@/ports/health-check-port";

export class EntraHealthCheckAdapter implements HealthCheckPort {
  name = "entra";

  async check(): Promise<HealthStatus> {
    return "ok";
  }
}
