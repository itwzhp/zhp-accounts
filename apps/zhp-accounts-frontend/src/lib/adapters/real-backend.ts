import type { BackendQueryPort } from '@/lib/ports/backend-querying'
import type { ZhpUnit, ZhpMemberDetails } from 'zhp-accounts-types'

/**
 * Real backend adapter that communicates with the actual API.
 * TODO: Implement actual API calls
 */
export class RealBackendAdapter implements BackendQueryPort {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getRootUnits(): Promise<ZhpUnit[]> {
    const response = await fetch(`${this.baseUrl}/units`)
    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`)
    }
    return response.json()
  }

  async getSubUnits(parentId: number): Promise<import('zhp-accounts-types').UnitsWithRoot> {
    // Fetch both the parent unit and its subunits
    const [unitResponse, subunitsResponse] = await Promise.all([
      fetch(`${this.baseUrl}/units/${parentId}`),
      fetch(`${this.baseUrl}/units/${parentId}/subunits`)
    ])
    
    if (!unitResponse.ok) {
      throw new Error(`Failed to fetch unit: ${unitResponse.statusText}`)
    }
    if (!subunitsResponse.ok) {
      throw new Error(`Failed to fetch subunits: ${subunitsResponse.statusText}`)
    }
    
    const [root, subunits] = await Promise.all([
      unitResponse.json(),
      subunitsResponse.json()
    ])
    
    return { root, subunits }
  }

  async getMembers(unitId: number): Promise<import('zhp-accounts-types').MembersWithUnit> {
    // Fetch both the unit and its members
    const [unitResponse, membersResponse] = await Promise.all([
      fetch(`${this.baseUrl}/units/${unitId}`),
      fetch(`${this.baseUrl}/units/${unitId}/members`)
    ])
    
    if (!unitResponse.ok) {
      throw new Error(`Failed to fetch unit: ${unitResponse.statusText}`)
    }
    if (!membersResponse.ok) {
      throw new Error(`Failed to fetch members: ${membersResponse.statusText}`)
    }
    
    const [unit, members] = await Promise.all([
      unitResponse.json(),
      membersResponse.json()
    ])
    
    return { unit, members }
  }

  async getMember(memberId: string): Promise<ZhpMemberDetails | null> {
    const response = await fetch(`${this.baseUrl}/members/${memberId}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch member: ${response.statusText}`)
    }
    return response.json()
  }
}
