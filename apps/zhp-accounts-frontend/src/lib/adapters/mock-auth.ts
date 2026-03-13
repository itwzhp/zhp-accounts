import type { AuthPort, AuthResult } from '@/lib/ports/auth'

/**
 * Mock auth adapter for development/testing.
 */
export class MockAuthAdapter implements AuthPort {
  private token: string | null = null
  private userName: string | null = null

  async handleRedirectCallback(): Promise<AuthResult | null> {
    // Mock adapter doesn't handle redirects
    return null
  }

  async login(): Promise<AuthResult | null> {
    // Simulate login delay
    await this.delay(1000)

    const result: AuthResult = {
      userName: 'Jan Kowalski'
    }

    this.token = 'TEST_TOKEN'
    this.userName = result.userName

    return result
  }

  async logout(): Promise<void> {
    await this.delay(100)
    this.token = null
    this.userName = null
  }

  async getToken(): Promise<string | null> {
    return this.token
  }

  async getAuthenticationStatus(): Promise<AuthResult | null> {
    if (!this.token || !this.userName) {
      return null
    }

    return { userName: this.userName }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
