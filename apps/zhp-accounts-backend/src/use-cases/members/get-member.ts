import type { EntraMemberDetailsPort } from "@/use-cases/accounts/ports/entra-member-details-port";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";
import type { ZhpMemberDetails } from "zhp-accounts-types";

export async function getMember(
  entraPort: EntraMemberDetailsPort,
  tipiPort: TipiQueryPort,
  memberId: string,
): Promise<ZhpMemberDetails> {
  const [entraMemberDetails, tipiMember] = await Promise.all([
    entraPort.getMemberDetails(memberId),
    tipiPort.getMember(memberId),
  ]);

  return {
    mail: entraMemberDetails?.mail ?? null,
    canMailBeCorrected: entraMemberDetails?.canMailBeCorrected ?? false,
    isAdmin: entraMemberDetails?.isAdmin ?? false,
    membershipNumber: memberId,
    name: tipiMember?.name ?? "",
    surname: tipiMember?.surname ?? "",
  };
}
