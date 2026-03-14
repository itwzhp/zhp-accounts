import type { ZhpMember, ZhpUnit } from "zhp-accounts-types";

export interface TipiQueryPort {
  getRootUnits(memberNum: string): Promise<ZhpUnit[]>;
  getUnit(unitId: number): Promise<ZhpUnit>;
  getSubUnits(memberNum: string, parentId: number): Promise<ZhpUnit[]>;
  getMembers(unitId: number): Promise<ZhpMember[]>;
  getMember(membershipNumber: string): Promise<ZhpMember | null>;
}