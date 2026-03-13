import type { MembersWithUnit, UnitsWithRoot, ZhpMember, ZhpUnit } from "zhp-accounts-types";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";

export class NullTipiQueryAdapter implements TipiQueryPort {
  async getRootUnits(memberNum: string): Promise<ZhpUnit[]> {
    void memberNum;
    return [];
  }

  async getSubUnits(memberNum: string, parentId: number): Promise<UnitsWithRoot> {
    void memberNum;
    void parentId;
    return {} as UnitsWithRoot;
  }

  async getMembers(unitId: number): Promise<MembersWithUnit> {
    void unitId;
    return {} as MembersWithUnit;
  }

  async getMember(membershipNumber: string): Promise<ZhpMember | null> {
    void membershipNumber;
    return null;
  }
}
