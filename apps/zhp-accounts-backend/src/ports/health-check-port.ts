import type { HealthStatus } from "@/entities/health";

export interface HealthCheckPort {
  name: string;
  check(): Promise<HealthStatus>;
}
