import type { BackendCommandPort } from '@/lib/ports/backend-commands'
import type { AuthPort } from '@/lib/ports/auth'
import { UnauthenticatedError } from '@/lib/errors'
import { getMemberInternalAuthToken } from '@/lib/adapters/internal-auth-cache'
import type {
  CreateAccountCommand,
  CreateAccountResponse,
  GenerateTapCommand,
  GenerateTapResponse,
  Result,
} from 'zhp-accounts-types'

/**
 * Real backend commands adapter for production use.
 */
export class RealBackendCommandsAdapter implements BackendCommandPort {
  private apiBaseUrl: string
  private readonly authAdapter: AuthPort

  constructor(apiBaseUrl: string, authAdapter: AuthPort) {
    this.apiBaseUrl = apiBaseUrl
    this.authAdapter = authAdapter
  }

  private async createAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.authAdapter.getToken()
    if (!token) {
      throw new UnauthenticatedError('Missing access token for backend request')
    }

    return {
      Authorization: `Bearer ${token}`
    }
  }

  private async createCommandHeaders(membershipNumber: string): Promise<Record<string, string>> {
    const authHeaders = await this.createAuthHeaders()
    const internalAuthToken = getMemberInternalAuthToken(membershipNumber)

    if (!internalAuthToken) {
      throw new UnauthenticatedError('Missing internal auth token for command request')
    }

    return {
      ...authHeaders,
      'X-InternalAuth': internalAuthToken,
    }
  }

  private async sendCommand<T>(
    commandName: string,
    command: unknown,
    membershipNumber: string,
  ): Promise<Result<T>> {
    try {
      const commandHeaders = await this.createCommandHeaders(membershipNumber)
      const response = await fetch(`${this.apiBaseUrl}/commands/${commandName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...commandHeaders,
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
    return this.sendCommand<CreateAccountResponse>('CreateAccount', command, command.membershipNumber)
  }

  async generateTap(command: GenerateTapCommand): Promise<Result<GenerateTapResponse>> {
    return this.sendCommand<GenerateTapResponse>('GenerateTap', command, command.membershipNumber)
  }
}
