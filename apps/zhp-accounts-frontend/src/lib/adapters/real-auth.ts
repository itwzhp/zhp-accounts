import type { AuthPort, AuthResult } from '@/lib/ports/auth'
import type { ZhpAccount } from 'zhp-accounts-types'

/**
 * Real auth adapter that handles Microsoft 365 OAuth flow.
 * TODO: Implement MSAL.js integration
 */
export class RealAuthAdapter implements AuthPort {
  async login(): Promise<AuthResult> {
    // TODO: Implement MSAL.js login flow
    throw new Error('Not implemented: MSAL.js integration pending')
  }

  async logout(): Promise<void> {
    // TODO: Implement MSAL.js logout
    throw new Error('Not implemented: MSAL.js integration pending')
  }

  async getToken(): Promise<string | null> {
    // TODO: Implement token retrieval from MSAL
    return null
  }

  async getAccount(): Promise<ZhpAccount | null> {
    // TODO: Implement account retrieval
    return null
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken()
    return token !== null
  }
}
