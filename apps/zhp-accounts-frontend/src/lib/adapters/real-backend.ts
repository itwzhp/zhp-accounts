import type { BackendPort } from '@/lib/ports/backend'
import type { ZhpUnit, ZhpMember } from 'zhp-accounts-types'

/**
 * Real backend adapter that communicates with the actual API.
 * TODO: Implement actual API calls
 */
export class RealBackendAdapter implements BackendPort {
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/health`)
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`)
    }
    return response.json()
  }

  async getUnits(): Promise<ZhpUnit[]> {
    const response = await fetch(`${this.baseUrl}/units`)
    if (!response.ok) {
      throw new Error(`Failed to fetch units: ${response.statusText}`)
    }
    return response.json()
  }

  async getUnit(id: number): Promise<ZhpUnit | null> {
    const response = await fetch(`${this.baseUrl}/units/${id}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch unit: ${response.statusText}`)
    }
    return response.json()
  }

  async getMembers(unitId: number): Promise<ZhpMember[]> {
    const response = await fetch(`${this.baseUrl}/units/${unitId}/members`)
    if (!response.ok) {
      throw new Error(`Failed to fetch members: ${response.statusText}`)
    }
    return response.json()
  }

  async getMember(id: number): Promise<ZhpMember | null> {
    const response = await fetch(`${this.baseUrl}/members/${id}`)
    if (response.status === 404) {
      return null
    }
    if (!response.ok) {
      throw new Error(`Failed to fetch member: ${response.statusText}`)
    }
    return response.json()
  }
}
