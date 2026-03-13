import type { ZhpUnit } from "zhp-accounts-types";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";

export async function getRootUnits(port: TipiQueryPort, memberNum: string): Promise<ZhpUnit[]> {
  const units = await port.getRootUnits(memberNum);

  return units ?? [];
}
