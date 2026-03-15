import type { BackendQueryPort } from '@/lib/ports/backend-querying'
import { rememberMemberInternalAuthToken, rememberUnitInternalAuthToken } from '@/lib/adapters/internal-auth-cache'
import type {
  MembersWithUnitWithAuth,
  RootUnitsWithAuth,
  UnitsWithRootWithAuth,
  ZhpMemberDetails,
  ZhpUnit,
  ZhpUnitType,
} from 'zhp-accounts-types'

/**
 * Mock backend adapter that returns fake data for development/testing.
 */
export class MockBackendAdapter implements BackendQueryPort {
  private readonly delayMs = 300;

  private readonly mockMembers: ZhpMemberDetails[] = [
    {
      name: 'Jan',
      surname: 'Kowalski',
      membershipNumber: 'AA001234',
      mail: 'jan.kowalski@zhp.pl',
      canMailBeCorrected: true,
      isAdmin: false
    },
    {
      name: 'Anna',
      surname: 'Nowak',
      membershipNumber: 'AA005678',
      mail: 'anna.nowak@zhp.pl',
      canMailBeCorrected: false,
      isAdmin: true
    },
    {
      name: 'Piotr',
      surname: 'Wiśniewski',
      membershipNumber: 'BB001111',
      mail: 'piotr.wisniewski@zhp.pl',
      canMailBeCorrected: false,
      isAdmin: false
    },
    {
      name: 'Magdalena',
      surname: 'Lewandowska',
      membershipNumber: 'CC002222',
      mail: 'magdalena.lewandowska@zhp.pl',
      canMailBeCorrected: true,
      isAdmin: true
    },
    {
      name: 'Tomasz',
      surname: 'Kamiński',
      membershipNumber: 'XD003333',
      mail: 'tomasz.kaminski@zhp.pl',
      canMailBeCorrected: false,
      isAdmin: false
    },
    {
      name: 'Agnieszka',
      surname: 'Szymańska',
      membershipNumber: 'EE004444',
      mail: null,
      canMailBeCorrected: false,
      isAdmin: false
    },
    {
      name: 'Agnieszka',
      surname: 'Malewska',
      membershipNumber: 'XE005555',
      mail: null,
      canMailBeCorrected: false,
      isAdmin: false
    }
  ]

  private readonly mockUnits: ZhpMockUnit[] = [
    new ZhpMockUnit(1, 'Chorągiew Stołeczna', 'choragiew'),
    new ZhpMockUnit(2, 'Chorągiew Gdańska', 'choragiew'),
  ]

  constructor() {
    // Chorągiew Stołeczna subunits
    const hufieckMokotow = new ZhpMockUnit(3, 'Hufiec Warszawa-Mokotów', 'hufiec')
    hufieckMokotow.members.push(
      this.mockMembers[0],  // Jan Kowalski
      this.mockMembers[1],  // Anna Nowak
      this.mockMembers[4]   // Tomasz Kamiński
    )
    hufieckMokotow.subunits.push(new ZhpMockUnit(8, '1 WDH Mokotów', 'pjo'))
    hufieckMokotow.subunits.push(new ZhpMockUnit(9, '2 WDH Mokotów', 'pjo'))
    this.mockUnits[0].subunits.push(hufieckMokotow)

    const hufiecPraga = new ZhpMockUnit(4, 'Hufiec Praga', 'hufiec')
    hufiecPraga.members.push(
      this.mockMembers[2],  // Piotr Wiśniewski
      this.mockMembers[5],   // Agnieszka Szymańska
      this.mockMembers[6]    // Agnieszka Malewska
    )
    hufiecPraga.subunits.push(new ZhpMockUnit(13, '1 WDH Praga', 'pjo'))
    this.mockUnits[0].subunits.push(hufiecPraga)

    const hufiecWawer = new ZhpMockUnit(6, 'Hufiec Warszawa-Wawer', 'hufiec')
    hufiecWawer.members.push(
      this.mockMembers[3],  // Magdalena Lewandowska
      this.mockMembers[0]   // Jan Kowalski (reused)
    )
    hufiecWawer.subunits.push(new ZhpMockUnit(14, '1 WDH Wawer', 'pjo'))
    this.mockUnits[0].subunits.push(hufiecWawer)

    const hufiecPiaseczno = new ZhpMockUnit(7, 'Hufiec Warszawa-Piaseczno', 'hufiec')
    hufiecPiaseczno.members.push(
      this.mockMembers[1],  // Anna Nowak (reused)
      this.mockMembers[5]   // Agnieszka Szymańska (reused)
    )
    hufiecPiaseczno.subunits.push(new ZhpMockUnit(15, '1 WDH Piaseczno', 'pjo'))
    hufiecPiaseczno.subunits.push(new ZhpMockUnit(16, '2 WDH Piaseczno', 'pjo'))
    this.mockUnits[0].subunits.push(hufiecPiaseczno)

    // Chorągiew Gdańska subunits
    const hufiecGdansk = new ZhpMockUnit(5, 'Hufiec Gdańsk', 'hufiec')
    hufiecGdansk.members.push(
      this.mockMembers[2],  // Piotr Wiśniewski (reused)
      this.mockMembers[4]   // Tomasz Kamiński (reused)
    )
    hufiecGdansk.subunits.push(new ZhpMockUnit(17, '1 WDH Gdańsk', 'pjo'))
    hufiecGdansk.subunits.push(new ZhpMockUnit(18, '2 WDH Gdańsk', 'pjo'))
    this.mockUnits[1].subunits.push(hufiecGdansk)

    const hufiecGdynia = new ZhpMockUnit(10, 'Hufiec Gdynia', 'hufiec')
    hufiecGdynia.members.push(
      this.mockMembers[3]   // Magdalena Lewandowska (reused)
    )
    hufiecGdynia.subunits.push(new ZhpMockUnit(19, '1 WDH Gdynia', 'pjo'))
    this.mockUnits[1].subunits.push(hufiecGdynia)

    const hufiecSopot = new ZhpMockUnit(11, 'Hufiec Sopot', 'hufiec')
    hufiecSopot.members.push(
      this.mockMembers[5],  // Agnieszka Szymańska (reused)
      this.mockMembers[0]   // Jan Kowalski (reused)
    )
    hufiecSopot.subunits.push(new ZhpMockUnit(20, '1 WDH Sopot', 'pjo'))
    this.mockUnits[1].subunits.push(hufiecSopot)
  }

  async getRootUnits(): Promise<RootUnitsWithAuth> {
    console.info('[MockBackend] getRootUnits()')
    // Simulate network delay
    await this.delay(this.delayMs)
    const result = {
      units: [...this.mockUnits],
      internalAuthToken: 'mock-internal-auth-root'
    }
    rememberUnitInternalAuthToken(result.units.map((unit) => unit.id), result.internalAuthToken)
    console.info('[MockBackend] getRootUnits() -> ', result)
    return result
  }

  async getSubUnits(parentId: number): Promise<UnitsWithRootWithAuth> {
    console.info('[MockBackend] getSubUnits(parentId)', parentId)
    await this.delay(this.delayMs)
    const parentUnit = this.findUnitRecursive(parentId, this.mockUnits)
    if (!parentUnit) {
      throw new Error(`Unit with id ${parentId} not found`)
    }
    const result = {
      root: { id: parentUnit.id, name: parentUnit.name, type: parentUnit.type },
      subunits: parentUnit.subunits,
      internalAuthToken: `mock-internal-auth-units-${parentUnit.id}`
    }
    rememberUnitInternalAuthToken(
      [result.root.id, ...result.subunits.map((subunit) => subunit.id)],
      result.internalAuthToken,
    )
    console.info('[MockBackend] getSubUnits(', parentId, ') -> ', result)
    return result
  }

  private findUnitRecursive(id: number, units: ZhpMockUnit[]): ZhpMockUnit | undefined {
    for (const unit of units) {
      if (unit.id === id) {
        return unit
      }
      const found = this.findUnitRecursive(id, unit.subunits)
      if (found) {
        return found
      }
    }
    return undefined
  }

  async getMembers(unitId: number): Promise<MembersWithUnitWithAuth> {
    console.info('[MockBackend] getMembers(', unitId, ')')
    await this.delay(this.delayMs)
    const unit = this.findUnitRecursive(unitId, this.mockUnits)
    if (!unit) {
      throw new Error(`Unit with id ${unitId} not found`)
    }
    const result = {
      unit: { id: unit.id, name: unit.name, type: unit.type },
      members: unit.members,
      internalAuthToken: `mock-internal-auth-${unit.id}`
    }
    rememberMemberInternalAuthToken(unit.members.map((member) => member.membershipNumber), result.internalAuthToken)
    console.info('[MockBackend] getMembers(', unitId, ') -> ', result)
    return result
  }

  async getMember(membershipNumber: string): Promise<ZhpMemberDetails | null> {
    console.info('[MockBackend] getMember(', membershipNumber, ')')
    await this.delay(this.delayMs)
    const result = this.mockMembers.find(m => m.membershipNumber === membershipNumber) ?? null
    console.info('[MockBackend] getMember(', membershipNumber, ') -> ', result)
    return result
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}


class ZhpMockUnit implements ZhpUnit {
  id: number;
  name: string;
  type: ZhpUnitType;
  subunits: ZhpMockUnit[] = []
  members: ZhpMemberDetails[] = []

  constructor(id: number, name: string, type: ZhpUnitType) {
    this.id = id;
    this.name = name;
    this.type = type;
  }
}