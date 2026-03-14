export interface AuditLoggerPort {
  log(actorLogin: string, subjectMembershipNumber: string, action: string, details?: Record<string, any>): Promise<void>;
}