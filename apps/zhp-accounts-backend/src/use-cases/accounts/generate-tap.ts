import type { GenerateTapCommand, GenerateTapResponse } from "zhp-accounts-types";
import { getAuditLoggerPort, getEntraAccountCommandsPort, getEntraMemberDetailsPort, getMailNotificationPort } from "@/frameworks/providers/service-provider";

export async function generateTap(
    command: GenerateTapCommand,
    actorLogin: string
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

    const result = await commandPort.generateTap(command.membershipNumber);
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
    await auditLogger.log(actorLogin, command.membershipNumber, "GenerateTAP");
    return result;
}