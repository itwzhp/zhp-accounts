import type { EntraAccount } from "zhp-accounts-types";

export interface EntraMemberDetailsPort {
  getMemberDetails(memberId: string): Promise<EntraAccount | null>;
}