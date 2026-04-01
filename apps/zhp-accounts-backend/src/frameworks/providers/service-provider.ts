import type { EntraAccountCommandsPort } from "@/ports/entra-account-commands-port";
import type { EntraMemberDetailsPort } from "@/ports/entra-member-details-port";
import type { TipiQueryPort } from "@/ports/tipi-query-port";
import type { AuditLoggerPort } from "@/ports/audit-logger-port";
import type { MailNotificationPort } from "@/ports/mail-notification-port";
import type { HealthCheckPort } from "@/ports/health-check-port";
import { MockTipiQueryAdapter } from "@/adapters/tipi/mock-tipi-query-adapter";
import { TipiQueryAdapter } from "@/adapters/tipi/tipi-query-adapter";
import { EntraMemberDetailsAdapter } from "@/adapters/entra/entra-member-details-adapter";
import { MockEntraMemberDetailsAdapter } from "@/adapters/entra/mock-entra-member-details-adapter";
import { MockEntraAccountCommandsAdapter } from "@/adapters/entra/mock-entra-account-commands-adapter";
import { EntraAccountCommandsAdapter } from "@/adapters/entra/entra-account-commands-adapter";
import { ConsoleAuditLoggerAdapter } from "@/adapters/audit/console-audit-logger-adapter";
import { ElasticAuditLoggerAdapter } from "@/adapters/audit/elastic-audit-logger-adapter";
import { ConsoleMailNotificationAdapter } from "@/adapters/mail/console-mail-notification-adapter";
import { config } from "@/config";
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
    if (config.mockTipi) {
      tipiQueryPort = new MockTipiQueryAdapter();
    } else {
      tipiQueryPort = new TipiQueryAdapter();
    }
  }

  return tipiQueryPort;
}

export function getEntraMemberDetailsPort(): EntraMemberDetailsPort {
  if (!entraMemberDetailsPort) {
    entraMemberDetailsPort = config.mockEntra
      ? new MockEntraMemberDetailsAdapter()
      : new EntraMemberDetailsAdapter();
  }

  return entraMemberDetailsPort;
}

export function getEntraAccountCommandsPort(): EntraAccountCommandsPort {
  if (!entraAccountCommandsPort) {
    if (config.mockEntra) {
      entraAccountCommandsPort = new MockEntraAccountCommandsAdapter();
    } else {
      entraAccountCommandsPort = new EntraAccountCommandsAdapter();
    }
  }

  return entraAccountCommandsPort;
}

export function getAuditLoggerPort(): AuditLoggerPort {
  if (!auditLoggerPort) {
    auditLoggerPort = config.mockAudit
      ? new ConsoleAuditLoggerAdapter()
      : new ElasticAuditLoggerAdapter();
  }

  return auditLoggerPort;
}

export function getMailNotificationPort(): MailNotificationPort {
  if (!mailNotificationPort) {
    if (config.mockMail) {
      mailNotificationPort = new ConsoleMailNotificationAdapter();
    } else {
      mailNotificationPort = new ConsoleMailNotificationAdapter();
    }
  }

  return mailNotificationPort;
}

export function getHealthChecks(): HealthCheckPort[] {
  if (!healthChecks) {
    healthChecks = [
      new TipiHealthCheckAdapter(),
      new EntraHealthCheckAdapter(),
      new AuditHealthCheckAdapter(getAuditLoggerPort()),
    ];
  }

  return healthChecks;
}
