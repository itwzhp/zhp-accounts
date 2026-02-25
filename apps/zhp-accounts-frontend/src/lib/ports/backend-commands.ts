import type {
  CreateAccountResponse,
  CreateAccountCommand,
  ResetPasswordCommand,
  ResetPasswordResponse,
  ResetMfaCommand,
  ResetMfaResponse,
  FixEmailCommand,
  FixEmailResponse,
  Result,
} from 'zhp-accounts-types'

export interface BackendCommandPort {
  createAccount(command: CreateAccountCommand): Promise<Result<CreateAccountResponse>>

  resetPassword(command: ResetPasswordCommand): Promise<Result<ResetPasswordResponse>>

  resetMfa(command: ResetMfaCommand): Promise<Result<ResetMfaResponse>>

  fixEmail(command: FixEmailCommand): Promise<Result<FixEmailResponse>>
}