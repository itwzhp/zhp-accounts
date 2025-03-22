export interface ZhpAccount {
    mail: string
    upn: string
    membershipNumber: string
    region: string
    district?: string

    isAdmin?: boolean
}
