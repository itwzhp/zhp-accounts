import type {
  ZhpMemberDetails,
  MembersWithUnitWithAuth,
  RootUnitsWithAuth,
  UnitsWithRootWithAuth,
} from 'zhp-accounts-types'

/**
 * Port interface for backend communication.
 * Implementations can be swapped between real API and mock data.
 */
export interface BackendQueryPort {
  /**
   * Get list of all units which belong to highest level, which user has access to
   */
  getRootUnits(): Promise<RootUnitsWithAuth>

  /**
   * Get sub-units (which user has access to) of a specific parent unit
   * Returns both the parent unit and its children
   */
  getSubUnits(parentId: number): Promise<UnitsWithRootWithAuth>

  /**
   * Get members of a specific unit
   * Returns both the unit and its members
   */
  getMembers(unitId: number): Promise<MembersWithUnitWithAuth>

  /**
   * Get a single member by ID
   */
  getMember(memberId: string): Promise<ZhpMemberDetails | null>
}
