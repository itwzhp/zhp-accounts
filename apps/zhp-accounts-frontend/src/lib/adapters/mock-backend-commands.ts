import type { BackendCommandPort } from '@/lib/ports/backend-commands'
import type {
  CreateAccountCommand,
  CreateAccountResponse,
  ResetPasswordCommand,
  ResetPasswordResponse,
  ResetMfaCommand,
  ResetMfaResponse,
  FixEmailCommand,
  FixEmailResponse,
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
          email: `${command.membershipNumber.toLowerCase()}@example.zhp.pl`,
          password: 'TempPassword123!',
        })
    console.info('[MockBackendCommands] createAccount(', command, ') -> ', result)
    return result
  }

  async resetPassword(command: ResetPasswordCommand): Promise<Result<ResetPasswordResponse>> {
    console.info('[MockBackendCommands] resetPassword(', command, ')')
    await this.delay(this.delayMs)
    const result = ok<ResetPasswordResponse>({})
    console.info('[MockBackendCommands] resetPassword(', command, ') -> ', result)
    return result
  }

  async resetMfa(command: ResetMfaCommand): Promise<Result<ResetMfaResponse>> {
    console.info('[MockBackendCommands] resetMfa(', command, ')')
    await this.delay(this.delayMs)
    const result = ok<ResetMfaResponse>({})
    console.info('[MockBackendCommands] resetMfa(', command, ') -> ', result)
    return result
  }

  async fixEmail(command: FixEmailCommand): Promise<Result<FixEmailResponse>> {
    console.info('[MockBackendCommands] fixEmail(', command, ')')
    await this.delay(this.delayMs)
    const result = ok<FixEmailResponse>({})
    console.info('[MockBackendCommands] fixEmail(', command, ') -> ', result)
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