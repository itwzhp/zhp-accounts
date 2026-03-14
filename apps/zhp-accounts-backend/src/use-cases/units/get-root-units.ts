import type { ZhpUnit } from "zhp-accounts-types";
import { getTipiQueryPort } from "@/frameworks/providers/service-provider";

export async function getRootUnits(memberNum: string): Promise<ZhpUnit[]> {
  const port = getTipiQueryPort();
  const units = await port.getRootUnits(memberNum);

  return units;
}
