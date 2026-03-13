import { describe, expect, it } from "vitest";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";
import { getRootUnits } from "@/use-cases/units/get-root-units";
import { getSubUnits } from "@/use-cases/units/get-sub-units";

describe("units use-cases", (): void => {
  it("maps null root units payload to empty array", async (): Promise<void> => {
    const port: TipiQueryPort = {
      getRootUnits: async () => null,
      getSubUnits: async () => null,
      getMembers: async () => null,
      getMember: async () => null,
    };

    const result = await getRootUnits(port);

    expect(result).toEqual([]);
  });

  it("maps null subunits payload to typed fallback", async (): Promise<void> => {
    const port: TipiQueryPort = {
      getRootUnits: async () => null,
      getSubUnits: async () => null,
      getMembers: async () => null,
      getMember: async () => null,
    };

    const result = await getSubUnits(port, 123);

    expect(result).toEqual({
      root: { id: 0, name: "", type: "pjo" },
      subunits: [],
    });
  });
});
