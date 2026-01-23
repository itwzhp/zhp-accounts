import type { BackendPort } from '@/lib/ports/backend'
import type { ZhpUnit, ZhpMember } from 'zhp-accounts-types'

/**
 * Mock backend adapter that returns fake data for development/testing.
 */
export class MockBackendAdapter implements BackendPort {
  private readonly mockUnits: ZhpUnit[] = [
    { id: 1, name: 'Chorągiew Stołeczna', region: 'mazowieckie', type: 'chorągiew' },
    { id: 2, name: 'Hufiec Warszawa-Mokotów', region: 'mazowieckie', type: 'hufiec' },
    { id: 3, name: 'Hufiec Kraków-Śródmieście', region: 'małopolskie', type: 'hufiec' },
    { id: 4, name: '1 WDH "Czarna Jedynka"', region: 'mazowieckie', type: 'pjo' }
  ]

  private readonly mockMembers: ZhpMember[] = [
    {
      id: 1,
      name: 'Jan',
      surname: 'Kowalski',
      membershipNumber: 'AA001234',
      district: 'Warszawa-Mokotów',
      region: 'mazowieckie',
      personalMail: 'jan.kowalski@example.com',
      isAdmin: false
    },
    {
      id: 2,
      name: 'Anna',
      surname: 'Nowak',
      membershipNumber: 'AA005678',
      district: 'Warszawa-Mokotów',
      region: 'mazowieckie',
      personalMail: 'anna.nowak@example.com',
      isAdmin: true
    },
    {
      id: 3,
      name: 'Piotr',
      surname: 'Wiśniewski',
      membershipNumber: 'BB001111',
      district: 'Kraków-Śródmieście',
      region: 'małopolskie',
      isAdmin: false
    }
  ]

  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  }

  async getUnits(): Promise<ZhpUnit[]> {
    // Simulate network delay
    await this.delay(100)
    return [...this.mockUnits]
  }

  async getUnit(id: number): Promise<ZhpUnit | null> {
    await this.delay(50)
    return this.mockUnits.find(u => u.id === id) ?? null
  }

  async getMembers(unitId: number): Promise<ZhpMember[]> {
    await this.delay(100)
    // Return members based on unit - simplified logic
    if (unitId === 2) {
      return this.mockMembers.filter(m => m.district === 'Warszawa-Mokotów')
    }
    if (unitId === 3) {
      return this.mockMembers.filter(m => m.district === 'Kraków-Śródmieście')
    }
    return []
  }

  async getMember(id: number): Promise<ZhpMember | null> {
    await this.delay(50)
    return this.mockMembers.find(m => m.id === id) ?? null
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
