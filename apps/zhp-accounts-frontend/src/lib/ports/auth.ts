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
    * Handle redirect callback after authentication.
    * Should be called on app initialization before checking getAuthenticationStatus()
   * Returns AuthResult if user just logged in via redirect, null otherwise
   */
  handleRedirectCallback(): Promise<AuthResult | null>

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
   * Get current authentication status
   */
  getAuthenticationStatus(): Promise<AuthResult | null>
}
