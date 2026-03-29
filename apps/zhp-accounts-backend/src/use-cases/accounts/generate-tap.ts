import type { GenerateTapCommand, GenerateTapResponse, Account } from "zhp-accounts-types";
import {
  getAuditLoggerPort,
  getEntraAccountCommandsPort,
  getEntraMemberDetailsPort,
  getMailNotificationPort,
} from "@/frameworks/providers/service-provider";

export async function generateTap(
  command: GenerateTapCommand,
    actor: Account,
): Promise<GenerateTapResponse> {
    const commandPort = getEntraAccountCommandsPort();
    const queryPort = getEntraMemberDetailsPort();
    const auditLogger = getAuditLoggerPort();
    const mailNotification = getMailNotificationPort();

    const existingAccount = await queryPort.getMemberDetails(command.membershipNumber);
    if(!existingAccount){
        throw new Error(`Nie znaleziono osoby o numerze ${command.membershipNumber}`);
    }
    if(existingAccount.isAdmin) {
        throw new Error(`Konto ${command.membershipNumber} ma uprawnienia administratora, nie można wygenerować TAP`);
    }

    const result = await commandPort.generateTap(existingAccount.upn);
    if (command.notificationEmail) {
        try {
            await mailNotification.notifyAboutGeneratedTap(command.notificationEmail, result);
        } catch (error) {
            console.error("Failed to send TAP notification", {
                membershipNumber: command.membershipNumber,
                notificationEmail: command.notificationEmail,
                error,
            });
        }
    }
    try {
        await auditLogger.log({
            level: "info",
            message: "Temporary access pass generated",
            eventType: "change",
            action: "user-tap-generate",
            outcome: "success",
            actor: {
                id: actor.id,
                upn: actor.upn,
                membershipNumber: actor.membershipNumber,
            },
            target: {
                id: existingAccount.id,
                upn: existingAccount.upn,
                membershipNumber: existingAccount.membershipNumber,
            },
            authentication: {
                validUntil: result.expiresAt,
            },
        });
    } catch (error) {
        console.error("Audit logging failed for GenerateTap", {
            action: "user-tap-generate",
            actorUpn: actor.upn,
            actorId: actor.id,
            targetMembershipNumber: command.membershipNumber,
            error,
        });
    }

    return result;
}