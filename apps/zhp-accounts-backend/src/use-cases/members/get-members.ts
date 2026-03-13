import type { MembersWithUnit } from "zhp-accounts-types";
import { EMPTY_UNIT } from "@/use-cases/accounts/defaults";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";

export async function getMembers(port: TipiQueryPort, unitId: number): Promise<MembersWithUnit> {
  const payload = await port.getMembers(unitId);

  return payload ?? { unit: EMPTY_UNIT, members: [] };
}
