import type { UnitsWithRoot } from "zhp-accounts-types";
import { getTipiQueryPort } from "@/frameworks/providers/service-provider";

export async function getSubUnits(
  memberNum: string,
  parentId: number,
): Promise<UnitsWithRoot> {
  const port = getTipiQueryPort();
  const unitsPromise = port.getSubUnits(memberNum, parentId);
  const rootPromise = port.getUnit(parentId);

  const [units, root] = await Promise.all([unitsPromise, rootPromise]);

  return { root, subunits: units };
}
