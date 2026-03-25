import type { BackendCommandPort } from '@/lib/ports/backend-commands'
import type {
  CreateAccountCommand,
  CreateAccountResponse,
  GenerateTapCommand,
  GenerateTapResponse,
  Failure,
  Result,
  Success,
} from 'zhp-accounts-types'

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
          password: 'TempPassword123!',
          account: {
            id: `mock-${command.membershipNumber}`,
            upn: `${command.membershipNumber.toLowerCase()}@example.zhp.pl`,
            membershipNumber: command.membershipNumber,
            isAdmin: false,
          },
        })
    console.info('[MockBackendCommands] createAccount(', command, ') -> ', result)
    return result
  }

  async generateTap(command: GenerateTapCommand): Promise<Result<GenerateTapResponse>> {
    console.info('[MockBackendCommands] generateTap(', command, ')')
    await this.delay(this.delayMs)
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
    const result = command.membershipNumber.startsWith('X')
      ? err('Nastąpił testowy błąd podczas generowania TAP')
      : ok<GenerateTapResponse>({
          tap: 'mock-temporary-access-pass-123456',
          expiresAt,
        })
    console.info('[MockBackendCommands] generateTap(', command, ') -> ', result)
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