import type { Result } from "zhp-accounts-types"

export interface BackendCommandPort {
    createAccount(membershipId : string): Promise<Result<void>>

    resetPassword(membershipId : string): Promise<Result<void>>

    resetMfa(membershipId : string): Promise<Result<void>>

    fixEmail(membershipId : string): Promise<Result<void>>
}