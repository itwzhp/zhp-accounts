import type { BackendQueryPort } from '@/lib/ports/backend-querying'
import type { AuthPort } from '@/lib/ports/auth'
import { UnauthenticatedError } from '@/lib/errors'
import {
  getMemberInternalAuthToken,
  getUnitInternalAuthToken,
  rememberMemberInternalAuthToken,
  rememberUnitInternalAuthToken,
} from '@/lib/adapters/internal-auth-cache'
import type {
  MembersWithUnitWithAuth,
  RootUnitsWithAuth,
  UnitsWithRootWithAuth,
  ZhpMemberDetails,
} from 'zhp-accounts-types'

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
      throw new UnauthenticatedError('Missing access token for backend request')
    }

    return {
      Authorization: `Bearer ${token}`
    }
  }

  async getRootUnits(): Promise<RootUnitsWithAuth> {
    const headers = await this.createAuthHeaders()
    const response = await fetch(`${this.baseUrl}/units`, { headers })
    if (response.status === 401) {
      throw new UnauthenticatedError('Unauthorized')
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`)
    }
    const payload = await response.json() as RootUnitsWithAuth

    rememberUnitInternalAuthToken(payload.units.map((unit) => unit.id), payload.internalAuthToken)

    return payload
  }

  async getSubUnits(parentId: number): Promise<UnitsWithRootWithAuth> {
    const headers = await this.createAuthHeaders()
    const internalAuthToken = getUnitInternalAuthToken(parentId)

    if (!internalAuthToken) {
      throw new UnauthenticatedError('Missing internal auth token for unit request')
    }

    const unitResponse = await fetch(`${this.baseUrl}/units/${parentId}`, {
      headers: {
        ...headers,
        'X-InternalAuth': internalAuthToken,
      },
    })
    
    if (unitResponse.status === 401) {
      throw new UnauthenticatedError('Unauthorized')
    }
    if (!unitResponse.ok) {
      throw new Error(`Failed to fetch unit: ${unitResponse.statusText}`)
    }
    
    const data = await unitResponse.json() as UnitsWithRootWithAuth

    rememberUnitInternalAuthToken(
      [data.root.id, ...data.subunits.map((unit) => unit.id)],
      data.internalAuthToken,
    )

    return data
  }

  async getMembers(unitId: number): Promise<MembersWithUnitWithAuth> {
    const headers = await this.createAuthHeaders()
    const internalAuthToken = getUnitInternalAuthToken(unitId)

    if (!internalAuthToken) {
      throw new UnauthenticatedError('Missing internal auth token for members list request')
    }

    const membersResponse = await fetch(`${this.baseUrl}/units/${unitId}/members`, {
      headers: {
        ...headers,
        'X-InternalAuth': internalAuthToken,
      },
    })
    
    if (membersResponse.status === 401) {
      throw new UnauthenticatedError('Unauthorized')
    }
    if (!membersResponse.ok) {
      throw new Error(`Failed to fetch members: ${membersResponse.statusText}`)
    }
    
    const members = await membersResponse.json() as MembersWithUnitWithAuth

    rememberMemberInternalAuthToken(
      members.members.map((member) => member.membershipNumber),
      members.internalAuthToken,
    )

    return members
  }

  async getMember(memberId: string): Promise<ZhpMemberDetails | null> {
    const headers = await this.createAuthHeaders()
    const internalAuthToken = getMemberInternalAuthToken(memberId)

    if (!internalAuthToken) {
      throw new UnauthenticatedError('Missing internal auth token for member request')
    }

    const response = await fetch(`${this.baseUrl}/members/${memberId}`, {
      headers: {
        ...headers,
        'X-InternalAuth': internalAuthToken,
      }
    })
    if (response.status === 404) {
      return null
    }
    if (response.status === 401) {
      throw new UnauthenticatedError('Unauthorized')
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch member: ${response.statusText}`)
    }
    return response.json()
  }
}
