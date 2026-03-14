import type { GenerateTapCommand, GenerateTapResponse } from "zhp-accounts-types";
import { getAuditLoggerPort, getEntraAccountCommandsPort } from "@/frameworks/providers/service-provider";

export async function generateTap(
    command: GenerateTapCommand,
    actorLogin: string
): Promise<GenerateTapResponse> {
    const port = getEntraAccountCommandsPort();
    const auditLogger = getAuditLoggerPort();

    var result = await port.generateTap(command.membershipNumber);
    await auditLogger.log(actorLogin, command.membershipNumber, "GenerateTAP");
    return result;
}