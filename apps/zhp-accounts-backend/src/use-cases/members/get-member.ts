import type { ZhpMemberDetails } from "zhp-accounts-types";
import {
  getEntraMemberDetailsPort,
  getTipiQueryPort,
} from "@/frameworks/providers/service-provider";

export async function getMember(
  memberId: string,
): Promise<ZhpMemberDetails> {
  const entraPort = getEntraMemberDetailsPort();
  const tipiPort = getTipiQueryPort();

  const [entraMemberDetails, tipiMember] = await Promise.all([
    entraPort.getMemberDetails(memberId),
    tipiPort.getMember(memberId),
  ]);

  if (!tipiMember) {
    throw new Error(`Member with ID ${memberId} not found in Tipi`);
  }

  return {
    mail: entraMemberDetails?.mail ?? null,
    canMailBeCorrected: entraMemberDetails?.canMailBeCorrected ?? false,
    isAdmin: entraMemberDetails?.isAdmin ?? false,
    membershipNumber: memberId,
    name: tipiMember.name,
    surname: tipiMember.surname,
  };
}
