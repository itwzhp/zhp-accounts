import type { AuditLoggerPort } from "@/ports/audit-logger-port";

export class ConsoleAuditLoggerAdapter implements AuditLoggerPort {
  async log(
    actorLogin: string,
    subjectMembershipNumber: string,
    action: string,
    details?: Record<string, any>,
  ): Promise<void> {
    const entry = {
      actorLogin,
      subjectMembershipNumber,
      action,
      details: details ?? null,
      timestamp: new Date().toISOString(),
    };

    console.info("[AuditLog]", entry);
  }
}
