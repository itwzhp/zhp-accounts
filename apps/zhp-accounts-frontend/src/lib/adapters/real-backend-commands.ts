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
  Result,
} from 'zhp-accounts-types'

/**
 * Real backend commands adapter for production use.
 */
export class RealBackendCommandsAdapter implements BackendCommandPort {
  private apiBaseUrl: string

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl
  }

  private async sendCommand<T>(commandName: string, command: unknown): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/commands/${commandName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error || `Command failed with status ${response.status}`,
          errorCode: `HTTP_${response.status}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data: data as T,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorCode: 'NETWORK_ERROR',
      }
    }
  }

  async createAccount(command: CreateAccountCommand): Promise<Result<CreateAccountResponse>> {
    return this.sendCommand<CreateAccountResponse>('CreateAccount', command)
  }

  async resetPassword(command: ResetPasswordCommand): Promise<Result<ResetPasswordResponse>> {
    return this.sendCommand<ResetPasswordResponse>('ResetPassword', command)
  }

  async resetMfa(command: ResetMfaCommand): Promise<Result<ResetMfaResponse>> {
    return this.sendCommand<ResetMfaResponse>('ResetMfa', command)
  }

  async fixEmail(command: FixEmailCommand): Promise<Result<FixEmailResponse>> {
    return this.sendCommand<FixEmailResponse>('FixEmail', command)
  }
}
