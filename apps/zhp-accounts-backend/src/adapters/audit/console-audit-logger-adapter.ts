import type { AuditLog, AuditLoggerPort } from "@/ports/audit-logger-port";

export class ConsoleAuditLoggerAdapter implements AuditLoggerPort {
  async log(entry: AuditLog): Promise<void> {
    const output = {
      ...entry,
      level: entry.level ?? "info",
      outcome: entry.outcome ?? "success",
      timestamp: new Date().toISOString(),
    };

    console.info("[AuditLog]", output);
  }
}
