import type { CreateAccountCommand, CreateAccountResponse } from "zhp-accounts-types";
import {
    getAuditLoggerPort,
  getEntraAccountCommandsPort,
  getTipiQueryPort,
} from "@/frameworks/providers/service-provider";

export async function createAccount(
  command: CreateAccountCommand,
  actorLogin: string,
): Promise<CreateAccountResponse> {
  const entraPort = getEntraAccountCommandsPort();
  const tipiPort = getTipiQueryPort();
  const auditLogger = getAuditLoggerPort();

  const accountOwner = await tipiPort.getMember(command.membershipNumber);

  if (!accountOwner) {
    throw new Error(`Nie znaleziono osoby o numerze ${command.membershipNumber}`);
  }

  if (!accountOwner.hasAllRequiredConsents) {
    throw new Error(`Osoba ${command.membershipNumber} nie ma wymaganych zgód w Tipi`);
  }

  const result = await entraPort.createAccount(accountOwner);
  await auditLogger.log(actorLogin, command.membershipNumber, "CreateAccount", {newEmail: result.email});
  return result;
}