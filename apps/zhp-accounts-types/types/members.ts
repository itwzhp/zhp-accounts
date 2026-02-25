import type { ZhpUnit } from "./units"

export interface ZhpMember {
    name: string
    surname: string
    membershipNumber: string
}

export interface ZhpMemberDetails extends ZhpMember {
    mail: string | null

    // Jeśli true to znaczy, że mail można regenerować - np. zaktualizować nazwisko albo przepiąć domenę na zhp.pl
    canMailBeCorrected: boolean
    
    isAdmin: boolean
}

/**
 * Response structure for getMembers - includes both the unit and its members
 */
export interface MembersWithUnit {
    unit: ZhpUnit
    members: ZhpMember[]
}