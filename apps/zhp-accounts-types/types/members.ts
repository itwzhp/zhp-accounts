import type {ZhpUnit} from "./units";

export interface ZhpMember {
    id: number
    name: string
    surname: string
    membershipNumber: string
    district: ZhpUnit

    personalMail?: string
    isAdmin: boolean
}
