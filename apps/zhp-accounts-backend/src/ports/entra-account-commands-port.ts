import type { CreateAccountResponse, GenerateTapResponse, ZhpMember } from "zhp-accounts-types";

export interface EntraAccountCommandsPort {
  createAccount(accountOwner: ZhpMember): Promise<CreateAccountResponse>;
  generateTap(memberNum: string): Promise<GenerateTapResponse>;
}