import type { HealthStatus } from "@/entities/health";
import type { HealthCheckPort } from "@/ports/health-check-port";
import { getGraphClient } from "@/adapters/entra/entra-graph-client";

export class EntraHealthCheckAdapter implements HealthCheckPort {
  name = "entra";

  async check(): Promise<HealthStatus> {
    await getGraphClient().api("/users").top(1).select(["id"]).get();
    return "ok";
  }
}
