import type { ZhpMemberDetails } from "zhp-accounts-types";

export interface EntraMemberDetailsPort {
  getMemberDetails(memberId: string): Promise<ZhpMemberDetails | null>;
}
