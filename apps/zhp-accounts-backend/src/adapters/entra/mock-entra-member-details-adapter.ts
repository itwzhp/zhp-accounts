import type { EntraMemberDetailsPort } from "@/ports/entra-member-details-port";
import type { EntraAccount } from "zhp-accounts-types";

const MOCK_MEMBER_DETAILS: Record<string, EntraAccount> = {
  AA001234: {
    id: "5ca74157-9ecf-4f98-b908-3d396965f7b1",
    upn: "jan.kowalski@zhp.pl",
    membershipNumber: "AA001234",
    isAdmin: false,
  },
  AA005678: {
    id: "83a41286-55a7-4f6a-9880-4f4bc8e51511",
    upn: "anna.nowak@zhp.pl",
    membershipNumber: "AA005678",
    isAdmin: true,
  },
  BB001111: {
    id: "be8f2f70-be10-4a8c-ae2f-9c92f8c5728e",
    upn: "piotr.wisniewski@zhp.pl",
    membershipNumber: "BB001111",
    isAdmin: false,
  },
  CC002222: {
    id: "0f654c35-f6ef-4ebf-bec5-f4cd3e65d980",
    upn: "magdalena.lewandowska@zhp.pl",
    membershipNumber: "CC002222",
    isAdmin: true,
  },
  XD003333: {
    id: "1b7730be-a968-41b8-8be2-4eb5e4149b24",
    upn: "tomasz.kaminski@zhp.pl",
    membershipNumber: "XD003333",
    isAdmin: false,
  },
  EE004444: {
    id: "d17dca47-8cef-4048-a790-007fd6f88ea8",
    upn: "ewa.example@zhp.pl",
    membershipNumber: "EE004444",
    isAdmin: false,
  },
  XE005555: {
    id: "7f6f7a87-7a6d-4987-8f94-bfd2ffe4e9f8",
    upn: "xawery.example@zhp.pl",
    membershipNumber: "XE005555",
    isAdmin: false,
  },
};

export class MockEntraMemberDetailsAdapter implements EntraMemberDetailsPort {
  async getMemberDetails(memberId: string): Promise<EntraAccount | null> {
    return MOCK_MEMBER_DETAILS[memberId] ?? null;
  }
}
