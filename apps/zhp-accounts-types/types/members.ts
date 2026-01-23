export interface ZhpMember {
    id: number
    name: string
    surname: string
    membershipNumber: string
    district: string
    region?: string

    personalMail?: string
    isAdmin: boolean
}
