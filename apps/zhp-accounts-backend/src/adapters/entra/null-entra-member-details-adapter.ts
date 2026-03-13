import type { EntraMemberDetailsPort } from "@/use-cases/accounts/ports/entra-member-details-port";
import type { ZhpMemberDetails } from "zhp-accounts-types";

const MOCK_MEMBER_DETAILS: Record<string, ZhpMemberDetails> = {
  AA001234: {
    name: "Jan",
    surname: "Kowalski",
    membershipNumber: "AA001234",
    mail: "jan.kowalski@zhp.pl",
    canMailBeCorrected: true,
    isAdmin: false,
  },
  AA005678: {
    name: "Anna",
    surname: "Nowak",
    membershipNumber: "AA005678",
    mail: "anna.nowak@zhp.pl",
    canMailBeCorrected: false,
    isAdmin: true,
  },
  BB001111: {
    name: "Piotr",
    surname: "Wiśniewski",
    membershipNumber: "BB001111",
    mail: "piotr.wisniewski@zhp.pl",
    canMailBeCorrected: false,
    isAdmin: false,
  },
  CC002222: {
    name: "Magdalena",
    surname: "Lewandowska",
    membershipNumber: "CC002222",
    mail: "magdalena.lewandowska@zhp.pl",
    canMailBeCorrected: true,
    isAdmin: true,
  },
  XD003333: {
    name: "Tomasz",
    surname: "Kamiński",
    membershipNumber: "XD003333",
    mail: "tomasz.kaminski@zhp.pl",
    canMailBeCorrected: false,
    isAdmin: false,
  },
  EE004444: {
    name: "Agnieszka",
    surname: "Szymańska",
    membershipNumber: "EE004444",
    mail: null,
    canMailBeCorrected: false,
    isAdmin: false,
  },
  XE005555: {
    name: "Agnieszka",
    surname: "Malewska",
    membershipNumber: "XE005555",
    mail: null,
    canMailBeCorrected: false,
    isAdmin: false,
  },
};

function fallbackDetails(memberId: string): ZhpMemberDetails {
  return {
    name: "Nieznany",
    surname: "Członek",
    membershipNumber: memberId,
    mail: null,
    canMailBeCorrected: false,
    isAdmin: false,
  };
}

export class NullEntraMemberDetailsAdapter implements EntraMemberDetailsPort {
  async getMemberDetails(memberId: string): Promise<ZhpMemberDetails | null> {
    return MOCK_MEMBER_DETAILS[memberId] ?? fallbackDetails(memberId);
  }
}
