import type { BackendQueryPort } from '@/lib/ports/backend-querying'
import type { AuthPort } from '@/lib/ports/auth'
import type { ZhpUnit, ZhpMemberDetails } from 'zhp-accounts-types'

/**
 * Real backend adapter that communicates with the actual API.
 * TODO: Implement actual API calls
 */
export class RealBackendAdapter implements BackendQueryPort {
  private readonly baseUrl: string
  private readonly authAdapter: AuthPort

  constructor(baseUrl: string, authAdapter: AuthPort) {
    this.baseUrl = baseUrl
    this.authAdapter = authAdapter
  }

  private async createAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.authAdapter.getToken()
    if (!token) {
      throw new Error('Missing access token for backend request')
    }

    return {
      Authorization: `Bearer ${token}`
    }
  }

  async getRootUnits(): Promise<ZhpUnit[]> {
    const headers = await this.createAuthHeaders()
    const response = await fetch(`${this.baseUrl}/units`, { headers })
    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`)
    }
    return response.json()
  }

  async getSubUnits(parentId: number): Promise<import('zhp-accounts-types').UnitsWithRoot> {
    const headers = await this.createAuthHeaders()
    const unitResponse = await fetch(`${this.baseUrl}/units/${parentId}`, { headers })
    
    if (!unitResponse.ok) {
      throw new Error(`Failed to fetch unit: ${unitResponse.statusText}`)
    }
    
    const data = await unitResponse.json()

    return data;
  }

  async getMembers(unitId: number): Promise<import('zhp-accounts-types').MembersWithUnit> {
    const headers = await this.createAuthHeaders()
    const membersResponse = await fetch(`${this.baseUrl}/units/${unitId}/members`, { headers })
    
    if (!membersResponse.ok) {
      throw new Error(`Failed to fetch members: ${membersResponse.statusText}`)
    }
    
    const members = await membersResponse.json()
    
    return members
  }

  async getMember(memberId: string): Promise<ZhpMemberDetails | null> {
    const headers = await this.createAuthHeaders()
    const response = await fetch(`${this.baseUrl}/members/${memberId}`, { headers })
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch member: ${response.statusText}`)
    }
    return response.json()
  }
}
