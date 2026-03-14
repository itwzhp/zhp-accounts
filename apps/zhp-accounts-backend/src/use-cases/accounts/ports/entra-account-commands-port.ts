import type { CreateAccountResponse, GenerateTapResponse } from "zhp-accounts-types";

export interface EntraAccountCommandsPort {
  createAccount(memberNum: string, actorLogin: string): Promise<CreateAccountResponse>;
  generateTap(memberNum: string, email: string, actorLogin: string): Promise<GenerateTapResponse>;
}