import type { CreateAccountResponse, GenerateTapResponse } from "zhp-accounts-types";
import type { TipiMemberDetails } from "@/entities/tipi-member-details";

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
  createAccount(accountOwner: TipiMemberDetails, upn: string): Promise<CreateAccountResult>;
  generateTap(upn: string): Promise<GenerateTapResponse>;
}