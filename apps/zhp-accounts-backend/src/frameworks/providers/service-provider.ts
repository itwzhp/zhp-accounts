import type { EntraAccountCommandsPort } from "@/ports/entra-account-commands-port";
import type { EntraMemberDetailsPort } from "@/ports/entra-member-details-port";
import type { TipiQueryPort } from "@/ports/tipi-query-port";
import type { AuditLoggerPort } from "@/ports/audit-logger-port";
import type { MailNotificationPort } from "@/ports/mail-notification-port";
import type { HealthCheckPort } from "@/ports/health-check-port";
import { MockTipiQueryAdapter } from "@/adapters/tipi/mock-tipi-query-adapter";
import { MockEntraMemberDetailsAdapter } from "@/adapters/entra/mock-entra-member-details-adapter";
import { MockEntraAccountCommandsAdapter } from "@/adapters/entra/mock-entra-account-commands-adapter";
import { ConsoleAuditLoggerAdapter } from "@/adapters/audit/console-audit-logger-adapter";
import { ConsoleMailNotificationAdapter } from "@/adapters/mail/console-mail-notification-adapter";
import { TipiHealthCheckAdapter } from "@/adapters/tipi/tipi-health-check-adapter";
import { EntraHealthCheckAdapter } from "@/adapters/entra/entra-health-check-adapter";
import { AuditHealthCheckAdapter } from "@/adapters/audit/audit-health-check-adapter";

let tipiQueryPort: TipiQueryPort | null = null;
let entraMemberDetailsPort: EntraMemberDetailsPort | null = null;
let entraAccountCommandsPort: EntraAccountCommandsPort | null = null;
let auditLoggerPort: AuditLoggerPort | null = null;
let mailNotificationPort: MailNotificationPort | null = null;
let healthChecks: HealthCheckPort[] | null = null;

export function getTipiQueryPort(): TipiQueryPort {
  if (!tipiQueryPort) {
    tipiQueryPort = new MockTipiQueryAdapter();
  }

  return tipiQueryPort;
}

export function getEntraMemberDetailsPort(): EntraMemberDetailsPort {
  if (!entraMemberDetailsPort) {
    entraMemberDetailsPort = new MockEntraMemberDetailsAdapter();
  }

  return entraMemberDetailsPort;
}

export function getEntraAccountCommandsPort(): EntraAccountCommandsPort {
  if (!entraAccountCommandsPort) {
    entraAccountCommandsPort = new MockEntraAccountCommandsAdapter();
  }

  return entraAccountCommandsPort;
}

export function getAuditLoggerPort(): AuditLoggerPort {
  if (!auditLoggerPort) {
    auditLoggerPort = new ConsoleAuditLoggerAdapter();
  }

  return auditLoggerPort;
}

export function getMailNotificationPort(): MailNotificationPort {
  if (!mailNotificationPort) {
    mailNotificationPort = new ConsoleMailNotificationAdapter();
  }

  return mailNotificationPort;
}

export function getHealthChecks(): HealthCheckPort[] {
  if (!healthChecks) {
    healthChecks = [
      new TipiHealthCheckAdapter(),
      new EntraHealthCheckAdapter(),
      new AuditHealthCheckAdapter(),
    ];
  }

  return healthChecks;
}
