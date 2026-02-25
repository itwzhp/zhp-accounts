import type { BackendCommandPort } from '@/lib/ports/backend-commands'
import type { CreateAccountCommand, CreateAccountResponse, Failure, Result, Success } from 'zhp-accounts-types'

/**
 * Mock backend commands adapter that returns fake data for development/testing.
 */
export class MockBackendCommandsAdapter implements BackendCommandPort {
  private readonly delayMs = 500

  async createAccount(command: CreateAccountCommand): Promise<Result<CreateAccountResponse>> {
    console.info('[MockBackendCommands] createAccount(', command, ')')
    await this.delay(this.delayMs)

    const result = command.membershipNumber.startsWith('X')
        ? err('Nastąpił testowy błąd podczas tworzenia konta')
        : ok<CreateAccountResponse>({
            email: `${command.membershipNumber.toLowerCase()}@example.zhp.pl`,
            password: 'TempPassword123!'})
    console.info('[MockBackendCommands] createAccount(', command, ') -> ', result)
    return result
  }

  async resetPassword(membershipId: string): Promise<Result<void>> {
    console.info('[MockBackendCommands] resetPassword(', membershipId, ')')
    await this.delay(this.delayMs)
    const result = ok<void>(undefined)
    console.info('[MockBackendCommands] resetPassword(', membershipId, ') -> ', result)
    return result
  }

  async resetMfa(membershipId: string): Promise<Result<void>> {
    console.info('[MockBackendCommands] resetMfa(', membershipId, ')')
    await this.delay(this.delayMs)
    const result = ok<void>(undefined)
    console.info('[MockBackendCommands] resetMfa(', membershipId, ') -> ', result)
    return result
  }

  async fixEmail(membershipId: string): Promise<Result<void>> {
    console.info('[MockBackendCommands] fixEmail(', membershipId, ')')
    await this.delay(this.delayMs)
    const result = ok<void>(undefined)
    console.info('[MockBackendCommands] fixEmail(', membershipId, ') -> ', result)
    return result
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

function ok<T>(data: T): Success<T> {
  return { success: true, data }
}

function err(error: string): Failure {
  return { success: false, error, errorCode: 'MOCK_ERROR' }
}