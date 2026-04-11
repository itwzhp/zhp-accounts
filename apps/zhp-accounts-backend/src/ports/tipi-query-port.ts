import type { ZhpMember, ZhpUnit } from "zhp-accounts-types";
import type { TipiMemberDetails } from "@/entities/tipi-member-details";

export interface TipiQueryPort {
  getRootUnits(memberNum: string): Promise<ZhpUnit[]>;
  getUnit(unitId: number): Promise<ZhpUnit>;
  getSubUnits(memberNum: string, parentId: number): Promise<ZhpUnit[]>;
  getMembers(unitId: number): Promise<ZhpMember[]>;
  getMember(membershipNumber: string): Promise<TipiMemberDetails | null>;
}