import type { MembersWithUnit, UnitsWithRoot, ZhpMember, ZhpUnit } from "zhp-accounts-types";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";

export class NullTipiQueryAdapter implements TipiQueryPort {
  async getRootUnits(): Promise<ZhpUnit[]> {
    return [];
  }

  async getSubUnits(parentId: number): Promise<UnitsWithRoot> {
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
