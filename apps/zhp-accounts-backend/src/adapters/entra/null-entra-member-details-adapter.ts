import type { EntraMemberDetailsPort } from "@/use-cases/accounts/ports/entra-member-details-port";
import type { ZhpMemberDetails } from "zhp-accounts-types";

export class NullEntraMemberDetailsAdapter implements EntraMemberDetailsPort {
  async getMemberDetails(memberId: string): Promise<ZhpMemberDetails> {
    void memberId;
    return {} as ZhpMemberDetails;
  }
}
