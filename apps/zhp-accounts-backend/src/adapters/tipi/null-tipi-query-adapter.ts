import type { MembersWithUnit, UnitsWithRoot, ZhpMember, ZhpUnit } from "zhp-accounts-types";
import type { TipiQueryPort } from "@/use-cases/accounts/ports/tipi-query-port";

const ROOT_UNITS: readonly ZhpUnit[] = [
  { id: 1, name: "Chorągiew Stołeczna", type: "choragiew" },
  { id: 2, name: "Chorągiew Gdańska", type: "choragiew" },
];

const SUBUNITS_BY_PARENT: Record<number, readonly ZhpUnit[]> = {
  1: [
    { id: 3, name: "Hufiec Warszawa-Mokotów", type: "hufiec" },
    { id: 4, name: "Hufiec Praga", type: "hufiec" },
    { id: 6, name: "Hufiec Warszawa-Wawer", type: "hufiec" },
    { id: 7, name: "Hufiec Warszawa-Piaseczno", type: "hufiec" },
  ],
  2: [
    { id: 5, name: "Hufiec Gdańsk", type: "hufiec" },
    { id: 10, name: "Hufiec Gdynia", type: "hufiec" },
    { id: 11, name: "Hufiec Sopot", type: "hufiec" },
  ],
  3: [
    { id: 8, name: "1 WDH Mokotów", type: "pjo" },
    { id: 9, name: "2 WDH Mokotów", type: "pjo" },
  ],
  4: [{ id: 13, name: "1 WDH Praga", type: "pjo" }],
  5: [
    { id: 17, name: "1 WDH Gdańsk", type: "pjo" },
    { id: 18, name: "2 WDH Gdańsk", type: "pjo" },
  ],
  6: [{ id: 14, name: "1 WDH Wawer", type: "pjo" }],
  7: [
    { id: 15, name: "1 WDH Piaseczno", type: "pjo" },
    { id: 16, name: "2 WDH Piaseczno", type: "pjo" },
  ],
  10: [{ id: 19, name: "1 WDH Gdynia", type: "pjo" }],
  11: [{ id: 20, name: "1 WDH Sopot", type: "pjo" }],
};

const MEMBERS_BY_NUMBER: Record<string, ZhpMember> = {
  AA001234: { name: "Jan", surname: "Kowalski", membershipNumber: "AA001234" },
  AA005678: { name: "Anna", surname: "Nowak", membershipNumber: "AA005678" },
  BB001111: { name: "Piotr", surname: "Wiśniewski", membershipNumber: "BB001111" },
  CC002222: { name: "Magdalena", surname: "Lewandowska", membershipNumber: "CC002222" },
  XD003333: { name: "Tomasz", surname: "Kamiński", membershipNumber: "XD003333" },
  EE004444: { name: "Agnieszka", surname: "Szymańska", membershipNumber: "EE004444" },
  XE005555: { name: "Agnieszka", surname: "Malewska", membershipNumber: "XE005555" },
};

const MEMBERSHIP_NUMBERS_BY_UNIT: Record<number, readonly string[]> = {
  3: ["AA001234", "AA005678", "XD003333"],
  4: ["BB001111", "EE004444", "XE005555"],
  5: ["BB001111", "XD003333"],
  6: ["CC002222", "AA001234"],
  7: ["AA005678", "EE004444"],
  10: ["CC002222"],
  11: ["EE004444", "AA001234"],
};

const ROOT_ACCESS_BY_MEMBER: Record<string, readonly number[]> = {
  AA001234: [1],
  AA005678: [1],
  BB001111: [2],
  CC002222: [1, 2],
  XD003333: [1, 2],
  EE004444: [1, 2],
  XE005555: [1],
};

const UNITS_BY_ID: Map<number, ZhpUnit> = buildUnitIndex();
const PARENT_BY_UNIT_ID: Map<number, number> = buildParentIndex();

function buildUnitIndex(): Map<number, ZhpUnit> {
  const entries: ZhpUnit[] = [...ROOT_UNITS];

  for (const subunits of Object.values(SUBUNITS_BY_PARENT)) {
    entries.push(...subunits);
  }

  return new Map(entries.map((unit) => [unit.id, unit]));
}

function buildParentIndex(): Map<number, number> {
  const index = new Map<number, number>();

  for (const [parentIdRaw, subunits] of Object.entries(SUBUNITS_BY_PARENT)) {
    const parentId = Number(parentIdRaw);

    for (const subunit of subunits) {
      index.set(subunit.id, parentId);
    }
  }

  return index;
}

function cloneUnit(unit: ZhpUnit): ZhpUnit {
  return { id: unit.id, name: unit.name, type: unit.type };
}

function fallbackMember(membershipNumber: string): ZhpMember {
  return { name: "Nieznany", surname: "Członek", membershipNumber };
}

function fallbackUnit(unitId: number): ZhpUnit {
  return { id: unitId, name: `Nieznana jednostka ${unitId}`, type: "pjo" };
}

function getAllowedRootIds(memberNum: string): readonly number[] {
  const exact = ROOT_ACCESS_BY_MEMBER[memberNum];

  if (exact) {
    return exact;
  }

  if (memberNum.startsWith("AA")) {
    return [1];
  }

  if (memberNum.startsWith("BB")) {
    return [2];
  }

  if (memberNum.startsWith("CC")) {
    return [1, 2];
  }

  return [];
}

function resolveRootId(unitId: number): number | null {
  if (ROOT_UNITS.some((unit) => unit.id === unitId)) {
    return unitId;
  }

  let current = unitId;

  while (PARENT_BY_UNIT_ID.has(current)) {
    const parentId = PARENT_BY_UNIT_ID.get(current);

    if (parentId === undefined) {
      break;
    }

    if (ROOT_UNITS.some((unit) => unit.id === parentId)) {
      return parentId;
    }

    current = parentId;
  }

  return null;
}

function hasAccessToUnit(memberNum: string, unitId: number): boolean {
  const rootId = resolveRootId(unitId);

  if (rootId === null) {
    return false;
  }

  return getAllowedRootIds(memberNum).includes(rootId);
}

export class NullTipiQueryAdapter implements TipiQueryPort {
  async getRootUnits(memberNum: string): Promise<ZhpUnit[]> {
    const allowedRootIds = getAllowedRootIds(memberNum);

    return ROOT_UNITS.filter((unit) => allowedRootIds.includes(unit.id)).map(cloneUnit);
  }

  async getSubUnits(memberNum: string, parentId: number): Promise<UnitsWithRoot> {
    const root = cloneUnit(UNITS_BY_ID.get(parentId) ?? fallbackUnit(parentId));

    if (!hasAccessToUnit(memberNum, parentId)) {
      return { root, subunits: [] };
    }

    const subunits = (SUBUNITS_BY_PARENT[parentId] ?? []).map(cloneUnit);

    return { root, subunits };
  }

  async getMembers(unitId: number): Promise<MembersWithUnit> {
    const unit = cloneUnit(UNITS_BY_ID.get(unitId) ?? fallbackUnit(unitId));
    const membershipNumbers = MEMBERSHIP_NUMBERS_BY_UNIT[unitId] ?? [];
    const members = membershipNumbers.map(
      (membershipNumber) => MEMBERS_BY_NUMBER[membershipNumber] ?? fallbackMember(membershipNumber),
    );

    return { unit, members };
  }

  async getMember(membershipNumber: string): Promise<ZhpMember | null> {
    return MEMBERS_BY_NUMBER[membershipNumber] ?? fallbackMember(membershipNumber);
  }
}
