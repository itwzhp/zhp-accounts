import type { BackendCommandPort } from '@/lib/ports/backend-commands'
import type { CreateAccountCommand, CreateAccountResponse, Result } from 'zhp-accounts-types'

/**
 * Real backend commands adapter for production use.
 */
export class RealBackendCommandsAdapter implements BackendCommandPort {
  constructor(_apiBaseUrl: string) {}

  async createAccount(_command: CreateAccountCommand): Promise<Result<CreateAccountResponse>> {
    // TODO: Implement
    throw new Error('Not implemented')
  }

  async resetPassword(_membershipId: string): Promise<Result<void>> {
    // TODO: Implement
    throw new Error('Not implemented')
  }

  async resetMfa(_membershipId: string): Promise<Result<void>> {
    // TODO: Implement
    throw new Error('Not implemented')
  }

  async fixEmail(_membershipId: string): Promise<Result<void>> {
    // TODO: Implement
    throw new Error('Not implemented')
  }
}
