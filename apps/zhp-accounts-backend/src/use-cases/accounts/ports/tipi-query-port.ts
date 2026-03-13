import type { MembersWithUnit, ZhpMember } from "zhp-accounts-types";
import type { UnitsWithRoot, ZhpUnit } from "zhp-accounts-types";

export interface TipiQueryPort {
  getRootUnits(): Promise<ZhpUnit[]>;
  getSubUnits(parentId: number): Promise<UnitsWithRoot>;
  getMembers(unitId: number): Promise<MembersWithUnit>;
  getMember(membershipNumber: string): Promise<ZhpMember | null>;
}
