import type {
  CreateAccountResponse,
  CreateAccountCommand,
  GenerateTapCommand,
  GenerateTapResponse,
  Result,
} from 'zhp-accounts-types'

export interface BackendCommandPort {
  createAccount(command: CreateAccountCommand): Promise<Result<CreateAccountResponse>>

  generateTap(command: GenerateTapCommand): Promise<Result<GenerateTapResponse>>
}