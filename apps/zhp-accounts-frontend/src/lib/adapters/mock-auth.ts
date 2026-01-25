import type { AuthPort, AuthResult } from '@/lib/ports/auth'
import type { ZhpAccount } from 'zhp-accounts-types'

const MOCK_ACCOUNT: ZhpAccount = {
  mail: 'jan.kowalski@zhp.net.pl',
  upn: 'jan.kowalski@zhp.net.pl',
  membershipNumber: 'AA001234',
  region: 'mazowieckie',
  district: 'Warszawa-Mokotów',
  isAdmin: false
}

/**
 * Mock auth adapter for development/testing.
 */
export class MockAuthAdapter implements AuthPort {
  private token: string | null = null
  private account: ZhpAccount | null = null

  async login(): Promise<AuthResult> {
    // Simulate login delay
    await this.delay(500)

    const result: AuthResult = {
      token: 'mock-jwt-token-' + Date.now(),
      account: MOCK_ACCOUNT,
      expiresAt: Date.now() + 3600 * 1000 // 1 hour
    }

    this.token = result.token
    this.account = result.account

    return result
  }

  async logout(): Promise<void> {
    await this.delay(100)
    this.token = null
    this.account = null
  }

  async getToken(): Promise<string | null> {
    return this.token
  }

  async getAccount(): Promise<ZhpAccount | null> {
    return this.account
  }

  async isAuthenticated(): Promise<boolean> {
    return this.token !== null
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
