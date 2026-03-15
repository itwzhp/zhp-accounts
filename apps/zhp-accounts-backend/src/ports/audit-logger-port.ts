export interface AuditLoggerPort {
  log(actorLogin: string, subjectMembershipNumber: string, action: string, details?: Record<string, unknown>): Promise<void>;
}