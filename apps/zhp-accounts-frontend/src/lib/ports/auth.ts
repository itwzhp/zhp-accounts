/**
 * Authentication result from login flow
 */
export interface AuthResult {
  userName: string
}

/**
 * Port interface for authentication.
 * Handles Microsoft 365 OAuth flow and token management.
 */
export interface AuthPort {
  /**
   * Initiate login flow with Microsoft 365
   * Returns authentication result on success and null on failure or cancellation
   */
  login(): Promise<AuthResult | null>

  /**
   * Logout and clear session
   */
  logout(): Promise<void>

  /**
   * Get current access token if available and not expired
   */
  getToken(): Promise<string | null>

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): Promise<boolean>
}
