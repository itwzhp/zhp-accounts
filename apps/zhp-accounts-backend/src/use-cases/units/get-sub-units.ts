import type { UnitsWithRoot } from "zhp-accounts-types";
import { EMPTY_UNIT } from "@/use-cases/accounts/defaults";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";

export async function getSubUnits(
  port: TipiQueryPort,
  memberNum: string,
  parentId: number,
): Promise<UnitsWithRoot> {
  const payload = await port.getSubUnits(memberNum, parentId);

  return payload ?? { root: EMPTY_UNIT, subunits: [] };
}
