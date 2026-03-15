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

  const [entraMember, tipiMember] = await Promise.all([
    entraPort.getMemberDetails(memberId),
    tipiPort.getMember(memberId),
  ]);

  if (!tipiMember) {
    throw new Error(`Member with ID ${memberId} not found in Tipi`);
  }

  return {
    mail: entraMember?.mail ?? null,
    canMailBeCorrected: false,
    isAdmin: entraMember?.isAdmin ?? false,
    membershipNumber: memberId,
    name: tipiMember.name,
    surname: tipiMember.surname,
    hasAllRequiredConsents: tipiMember.hasAllRequiredConsents,
  };
}
