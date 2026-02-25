import type { CreateAccountResponse, CreateAccountCommand, Result } from "zhp-accounts-types"

export interface BackendCommandPort {
    createAccount(command: CreateAccountCommand): Promise<Result<CreateAccountResponse>>

    resetPassword(membershipId : string): Promise<Result<void>>

    resetMfa(membershipId : string): Promise<Result<void>>

    fixEmail(membershipId : string): Promise<Result<void>>
}