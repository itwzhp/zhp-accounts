import type { HealthStatus } from "@/entities/health";
import { config } from "@/config";
import { getAzureTokenCredential } from "@/frameworks/providers/azure-token-credential-provider";
import type { HealthCheckPort } from "@/ports/health-check-port";

const MAIL_ACS_SCOPE = ["https://communication.azure.com/.default"];

export class MailHealthCheckAdapter implements HealthCheckPort {
  name = "mail";

  async check(): Promise<HealthStatus> {
    if (config.mockMail) {
      return "ok";
    }

    try {
      // Validate endpoint shape and credential ability to obtain ACS token.
      // This catches most configuration and identity issues without sending an email.
      new URL(config.mailAcsEndpoint);
      const token = await getAzureTokenCredential().getToken(MAIL_ACS_SCOPE);

      // TODO dorzucić test z samym API

      if (!token) {
        return "down";
      }

      return "ok";
    } catch (error) {
      console.info("[Health][mail] Failed to verify ACS mail credentials", {
        error: error instanceof Error ? error.message : String(error),
      });
      return "down";
    }
  }
}
