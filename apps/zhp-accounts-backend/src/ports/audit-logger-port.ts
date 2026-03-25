import type { Account } from "zhp-accounts-types";

export type AuditLogLevel = "info" | "warning" | "error";
export type AuditEventType = "creation" | "change";
export type AuditEventOutcome = "success" | "failure";

export interface AuditAuthentication {
  validUntil?: string;
}

export interface AuditLog {
  level?: AuditLogLevel;
  message: string;
  eventType: AuditEventType;
  action: string;
  outcome?: AuditEventOutcome;
  actor: Account;
  target: Account;
  authentication?: AuditAuthentication;
}

export interface AuditLoggerPort {
  log(entry: AuditLog): Promise<void>;
}