import type { CreateAccountResponse, GenerateTapResponse, ZhpMember } from "zhp-accounts-types";

export interface CreateAccountCreatedResult {
  status: "created";
  response: CreateAccountResponse;
}

export interface CreateAccountAlreadyExistsResult {
  status: "already-exists";
  upn: string;
}

export type CreateAccountResult = CreateAccountCreatedResult | CreateAccountAlreadyExistsResult;

export interface EntraAccountCommandsPort {
  createAccount(accountOwner: ZhpMember, upn: string): Promise<CreateAccountResult>;
  generateTap(upn: string): Promise<GenerateTapResponse>;
}