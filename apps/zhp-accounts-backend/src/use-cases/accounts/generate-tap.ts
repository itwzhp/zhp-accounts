import type { GenerateTapCommand, GenerateTapResponse } from "zhp-accounts-types";
import type { EntraAccountCommandsPort } from "@/use-cases/accounts/ports/entra-account-commands-port";

export async function generateTap(
  port: EntraAccountCommandsPort,
  command: GenerateTapCommand,
  login: string,
): Promise<GenerateTapResponse> {
  return port.generateTap(command.membershipNumber, command.email, login);
}