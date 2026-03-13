import type { EntraMemberDetailsPort } from "@/use-cases/accounts/ports/entra-member-details-port";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";
import type { ZhpMemberDetails } from "zhp-accounts-types";

export class MemberAccessDeniedError extends Error {
  constructor(memberId: string) {
    super(`Member ${memberId} is not allowed by internal auth token`);
    this.name = "MemberAccessDeniedError";
  }
}

export async function getMember(
  entraPort: EntraMemberDetailsPort,
  tipiPort: TipiQueryPort,
  memberId: string,
  allowedMemberNumbers: readonly string[],
): Promise<ZhpMemberDetails> {
  if (!allowedMemberNumbers.includes(memberId)) {
    throw new MemberAccessDeniedError(memberId);
  }

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
