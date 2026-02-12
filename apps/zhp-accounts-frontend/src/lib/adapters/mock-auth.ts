import type { AuthPort, AuthResult } from '@/lib/ports/auth'

/**
 * Mock auth adapter for development/testing.
 */
export class MockAuthAdapter implements AuthPort {
  private token: string | null = null

  async login(): Promise<AuthResult | null> {
    // Simulate login delay
    await this.delay(500)

    const result: AuthResult = {
      userName: 'Jan Kowalski'
    }

    this.token = 'TEST_TOKEN'

    return result
  }

  async logout(): Promise<void> {
    await this.delay(100)
    this.token = null
  }

  async getToken(): Promise<string | null> {
    return this.token
  }

  async isAuthenticated(): Promise<boolean> {
    return this.token !== null
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
