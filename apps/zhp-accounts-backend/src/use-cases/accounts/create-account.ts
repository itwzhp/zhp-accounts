import type { CreateAccountCommand, CreateAccountResponse } from "zhp-accounts-types";
import type { EntraAccountCommandsPort } from "@/use-cases/accounts/ports/entra-account-commands-port";

export async function createAccount(
  port: EntraAccountCommandsPort,
  command: CreateAccountCommand,
  login: string,
): Promise<CreateAccountResponse> {
  return port.createAccount(command.membershipNumber, login);
}