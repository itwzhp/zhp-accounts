import type { MembersWithUnit } from "zhp-accounts-types";
import { getTipiQueryPort } from "@/frameworks/providers/service-provider";

export async function getMembers(unitId: number): Promise<MembersWithUnit> {
  const port = getTipiQueryPort();
  const membersPromise = port.getMembers(unitId);
  const unitPromise = port.getUnit(unitId);

  const [members, unit] = await Promise.all([membersPromise, unitPromise]);

  return { unit, members };
}
