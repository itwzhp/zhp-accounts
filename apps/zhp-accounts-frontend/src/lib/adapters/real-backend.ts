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
    const unitResponse = await fetch(`${this.baseUrl}/units/${parentId}`)
    
    if (!unitResponse.ok) {
      throw new Error(`Failed to fetch unit: ${unitResponse.statusText}`)
    }
    
    const data = await unitResponse.json()

    return data;
  }

  async getMembers(unitId: number): Promise<import('zhp-accounts-types').MembersWithUnit> {
    const membersResponse = await fetch(`${this.baseUrl}/units/${unitId}/members`)
    
    if (!membersResponse.ok) {
      throw new Error(`Failed to fetch members: ${membersResponse.statusText}`)
    }
    
    const members = await membersResponse.json()
    
    return members
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
