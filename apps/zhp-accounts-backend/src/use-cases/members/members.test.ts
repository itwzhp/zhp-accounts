import { describe, expect, it } from "vitest";
import type { EntraMemberDetailsPort } from "@/use-cases/accounts/ports/entra-member-details-port";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";
import { getMember } from "@/use-cases/members/get-member";
import { getMembers } from "@/use-cases/members/get-members";

describe("members use-cases", (): void => {
  it("maps null members payload to typed fallback", async (): Promise<void> => {
    const port: TipiQueryPort = {
      getRootUnits: async () => null,
      getSubUnits: async () => null,
      getMembers: async () => null,
      getMember: async () => null,
    };

    const result = await getMembers(port, 321);

    expect(result).toEqual({
      unit: { id: 0, name: "", type: "pjo" },
      members: [],
    });
  });

  it("composes member details from Entra and Tipi with fallbacks", async (): Promise<void> => {
    const entraPort: EntraMemberDetailsPort = {
      getMemberDetails: async () => null,
    };
    const tipiPort: TipiQueryPort = {
      getRootUnits: async () => null,
      getSubUnits: async () => null,
      getMembers: async () => null,
      getMember: async () => ({
        membershipNumber: "different",
        name: "Jan",
        surname: "Kowalski",
      }),
    };

    const result = await getMember(entraPort, tipiPort, "abc");

    expect(result).toEqual({
      mail: null,
      canMailBeCorrected: false,
      isAdmin: false,
      membershipNumber: "abc",
      name: "Jan",
      surname: "Kowalski",
    });
  });
});
