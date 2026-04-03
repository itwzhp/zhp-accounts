import type { HealthStatus } from "@/entities/health";
import type { HealthCheckPort } from "@/ports/health-check-port";

export class MailHealthCheckAdapter implements HealthCheckPort {
  name = "mail";

  async check(): Promise<HealthStatus> {
    // Placeholder until a non-mock mail provider exposes a real health endpoint.
    return "ok";
  }
}
