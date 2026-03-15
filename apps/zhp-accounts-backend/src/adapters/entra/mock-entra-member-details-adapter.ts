import type { EntraMemberDetailsPort } from "@/ports/entra-member-details-port";
import type { EntraMember } from "@/entities/entra-member";

const MOCK_MEMBER_DETAILS: Record<string, EntraMember> = {
  AA001234: {
    mail: "jan.kowalski@zhp.pl",
    isAdmin: false,
  },
  AA005678: {
    mail: "anna.nowak@zhp.pl",
    isAdmin: true,
  },
  BB001111: {
    mail: "piotr.wisniewski@zhp.pl",
    isAdmin: false,
  },
  CC002222: {
    mail: "magdalena.lewandowska@zhp.pl",
    isAdmin: true,
  },
  XD003333: {
    mail: "tomasz.kaminski@zhp.pl",
    isAdmin: false,
  },
  EE004444: {
    mail: null,
    isAdmin: false,
  },
  XE005555: {
    mail: null,
    isAdmin: false,
  },
};

export class MockEntraMemberDetailsAdapter implements EntraMemberDetailsPort {
  async getMemberDetails(memberId: string): Promise<EntraMember | null> {
    return MOCK_MEMBER_DETAILS[memberId] ?? null;
  }
}
