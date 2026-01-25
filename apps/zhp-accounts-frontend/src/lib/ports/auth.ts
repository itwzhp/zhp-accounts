import type { ZhpAccount } from 'zhp-accounts-types'

/**
 * Authentication result from login flow
 */
export interface AuthResult {
  token: string
  account: ZhpAccount
  expiresAt: number
}

/**
 * Port interface for authentication.
 * Handles Microsoft 365 OAuth flow and token management.
 */
export interface AuthPort {
  /**
   * Initiate login flow with Microsoft 365
   * Returns authentication result on success
   */
  login(): Promise<AuthResult>

  /**
   * Logout and clear session
   */
  logout(): Promise<void>

  /**
   * Get current access token if available and not expired
   */
  getToken(): Promise<string | null>

  /**
   * Get current authenticated account info
   */
  getAccount(): Promise<ZhpAccount | null>

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): Promise<boolean>
}
