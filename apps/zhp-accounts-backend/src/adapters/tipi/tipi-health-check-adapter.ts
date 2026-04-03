import type { HealthStatus } from "@/entities/health";
import type { HealthCheckPort } from "@/ports/health-check-port";
import { config } from "@/config";

const HEALTHCHECK_TIMEOUT_MS = 1500;

export class TipiHealthCheckAdapter implements HealthCheckPort {
  name = "tipi";

  async check(): Promise<HealthStatus> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), HEALTHCHECK_TIMEOUT_MS);

    try {
      const response = await fetch(config.tipiApiBaseUrl, {
        method: "GET",
        headers: {
          "CF-Access-Client-Id": config.tipiApiClientId,
          "CF-Access-Client-Secret": config.tipiApiClientSecret,
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        console.info(`[Health][tipi] HTTP ${response.status} from ${config.tipiApiBaseUrl}`);
        return "down";
      }

      return "ok";
    } finally {
      clearTimeout(timeout);
    }
  }
}
