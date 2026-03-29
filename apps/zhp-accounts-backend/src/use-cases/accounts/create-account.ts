import type { CreateAccountCommand, CreateAccountResponse, Account } from "zhp-accounts-types";
import {
  getAuditLoggerPort,
  getEntraAccountCommandsPort,
  getEntraMemberDetailsPort,
  getMailNotificationPort,
  getTipiQueryPort,
} from "@/frameworks/providers/service-provider";
import { getPossibleAddressesForUser } from "@/shared/email-address-patterns";

export async function createAccount(
  command: CreateAccountCommand,
  actor: Account,
): Promise<CreateAccountResponse> {
  const entraPort = getEntraAccountCommandsPort();
  const entraMemberDetailsPort = getEntraMemberDetailsPort();
  const tipiPort = getTipiQueryPort();
  const auditLogger = getAuditLoggerPort();
  const mailNotification = getMailNotificationPort();

  const accountOwner = await tipiPort.getMember(command.membershipNumber);

  if (!accountOwner) {
    throw new Error(`Nie znaleziono osoby o numerze ${command.membershipNumber}`);
  }

  if (!accountOwner.hasAllRequiredConsents) {
    throw new Error(`Osoba ${command.membershipNumber} nie ma wymaganych zgód w Tipi`);
  }

  const existingAccount = await entraMemberDetailsPort.getMemberDetails(command.membershipNumber);
  if (existingAccount) {
    throw new Error(
      `Konto dla numeru członkowskiego ${command.membershipNumber} już istnieje (${existingAccount.upn})`,
    );
  }

  const possibleAddresses = getPossibleAddressesForUser(accountOwner.name, accountOwner.surname);
  if (possibleAddresses.length === 0) {
    throw new Error(
      `Nie udało się wygenerować poprawnych adresów email dla numeru ${command.membershipNumber}`,
    );
  }

  let result: CreateAccountResponse | null = null;
  for (const candidateAddress of possibleAddresses) {
    const createResult = await entraPort.createAccount(accountOwner, candidateAddress);
    if (createResult.status === "created") {
      result = createResult.response;
      break;
    }
  }

  if (!result) {
    throw new Error(
      `Wszystkie wzorce adresów email są zajęte dla numeru członkowskiego ${command.membershipNumber}`,
    );
  }

  if (command.notificationEmail) {
    try {
      await mailNotification.notifyAboutCreatedAccount(command.notificationEmail, result);
    } catch (error) {
      console.error("Failed to send account creation notification", {
        membershipNumber: command.membershipNumber,
        notificationEmail: command.notificationEmail,
        error,
      });
    }
  }

  try {
    await auditLogger.log({
      level: "info",
      message: "Mailbox account created",
      eventType: "creation",
      action: "user-mailbox-create",
      outcome: "success",
      actor: {
        id: actor.id,
        upn: actor.upn,
        membershipNumber: actor.membershipNumber,
      },
      target: {
        id: result.account.id,
        upn: result.account.upn,
        membershipNumber: result.account.membershipNumber,
      },
    });
  } catch (error) {
    console.error("Audit logging failed for CreateAccount", {
      action: "user-mailbox-create",
      actorUpn: actor.upn,
      actorId: actor.id,
      targetMembershipNumber: command.membershipNumber,
      error,
    });
  }
  return result;
}