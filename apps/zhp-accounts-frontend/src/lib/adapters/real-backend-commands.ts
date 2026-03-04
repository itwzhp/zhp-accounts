import type { BackendCommandPort } from '@/lib/ports/backend-commands'
import type { AuthPort } from '@/lib/ports/auth'
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
      throw new Error('Missing access token for backend request')
    }

    return {
      Authorization: `Bearer ${token}`
    }
  }

  private async sendCommand<T>(commandName: string, command: unknown): Promise<Result<T>> {
    try {
      const authHeaders = await this.createAuthHeaders()
      const response = await fetch(`${this.apiBaseUrl}/commands/${commandName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
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

  async generateTap(command: GenerateTapCommand): Promise<Result<GenerateTapResponse>> {
    return this.sendCommand<GenerateTapResponse>('GenerateTap', command)
  }
}
