import type { HealthStatus } from "@/entities/health";
import type { HealthCheckPort } from "@/ports/health-check-port";

export class TipiHealthCheckAdapter implements HealthCheckPort {
  name = "tipi";

  async check(): Promise<HealthStatus> {
    return "ok";
  }
}
