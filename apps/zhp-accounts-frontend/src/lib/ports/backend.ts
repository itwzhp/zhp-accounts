import type { ZhpUnit, ZhpMember } from 'zhp-accounts-types'

/**
 * Port interface for backend communication.
 * Implementations can be swapped between real API and mock data.
 */
export interface BackendPort {
  /**
   * Check backend health status
   */
  getHealth(): Promise<{ status: string; timestamp: string }>

  /**
   * Get list of all units
   */
  getUnits(): Promise<ZhpUnit[]>

  /**
   * Get a single unit by ID
   */
  getUnit(id: number): Promise<ZhpUnit | null>

  /**
   * Get members of a specific unit
   */
  getMembers(unitId: number): Promise<ZhpMember[]>

  /**
   * Get a single member by ID
   */
  getMember(id: number): Promise<ZhpMember | null>
}
