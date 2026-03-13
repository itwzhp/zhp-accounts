import type { AuthPort, AuthResult } from '@/lib/ports/auth'
import {
  PublicClientApplication,
  type AccountInfo,
  InteractionRequiredAuthError,
} from '@azure/msal-browser'
import { getMsalConfig, getLoginRequest, getTokenRequest } from './msal-config'

/**
 * Real auth adapter that handles Microsoft Entra ID (Azure AD) OAuth flow via MSAL.js
 * Uses redirect flow for reliable enterprise authentication
 * Tokens are cached in sessionStorage (cleared on tab close)
 */
export class RealAuthAdapter implements AuthPort {
  private msalInstance: PublicClientApplication | null = null
  private isInitializing = false
  private initializationPromise: Promise<void> | null = null

  private async ensureInitialized(): Promise<void> {
    if (this.msalInstance && !this.isInitializing) {
      return
    }

    // Ensure only one initialization happens at a time
    if (this.isInitializing) {
      if (this.initializationPromise) {
        await this.initializationPromise
      }
      return
    }

    this.isInitializing = true
    try {
      this.initializationPromise = this.initialize()
      await this.initializationPromise
    } finally {
      this.isInitializing = false
    }
  }

  private async initialize(): Promise<void> {
    try {
      const config = getMsalConfig()
      this.msalInstance = new PublicClientApplication(config)
      await this.msalInstance.initialize()
    } catch (error) {
      console.error('Failed to initialize MSAL:', error)
      throw new Error(`MSAL initialization failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private getActiveAccount(): AccountInfo | null {
    if (!this.msalInstance) {
      return null
    }

    const accounts = this.msalInstance.getAllAccounts()
    return accounts.length > 0 ? accounts[0] : null
  }

  async handleRedirectCallback(): Promise<AuthResult | null> {
    try {
      await this.ensureInitialized()

      if (!this.msalInstance) {
        return null
      }

      const result = await this.msalInstance.handleRedirectPromise()

      if (result) {
        // User just completed authentication, extract username
        const userName = result.account?.name || result.account?.username || 'User'
        return { userName }
      }

      return null
    } catch (error) {
      console.error('Error handling redirect callback:', error)
      return null
    }
  }

  async login(): Promise<AuthResult | null> {
    try {
      await this.ensureInitialized()

      if (!this.msalInstance) {
        throw new Error('MSAL instance not available')
      }

      const loginRequest = getLoginRequest()
      await this.msalInstance.loginRedirect(loginRequest)

      // loginRedirect causes a redirect, this code won't be reached
      // But return null for type safety
      return null
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error(`Login failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async logout(): Promise<void> {
    try {
      if (!this.msalInstance) {
        return
      }

      const account = this.getActiveAccount()
      // Clear account tokens from cache without logging out of Microsoft globally
      await this.msalInstance.clearCache({ account: account || undefined })
    } catch (error) {
      console.error('Logout failed:', error)
      // Don't throw on logout errors to prevent UI from breaking
      console.log('Continuing with logout despite error...')
    }
  }

  async getToken(): Promise<string | null> {
    try {
      await this.ensureInitialized()

      if (!this.msalInstance) {
        return null
      }

      const account = this.getActiveAccount()
      if (!account) {
        return null
      }

      const tokenRequest = getTokenRequest()

      try {
        // Try to get token silently from cache
        const result = await this.msalInstance.acquireTokenSilent({
          ...tokenRequest,
          account,
        })

        return result.accessToken
      } catch (error) {
        // If silent acquisition fails due to interaction required, try redirect
        if (error instanceof InteractionRequiredAuthError) {
          console.log('Token acquisition requires interaction, redirecting to login...')
          await this.msalInstance.acquireTokenRedirect({ ...tokenRequest, account })
          // acquireTokenRedirect causes a redirect, won't reach here
          return null
        }

        console.error('Failed to acquire token:', error)
        return null
      }
    } catch (error) {
      console.error('Error in getToken:', error)
      return null
    }
  }

  async getAuthenticationStatus(): Promise<AuthResult | null> {
    try {
      await this.ensureInitialized()

      if (!this.msalInstance) {
        return null
      }

      const account = this.getActiveAccount()
      if (!account) {
        return null
      }

      const userName = account.name || account.username || 'User'
      return { userName }
    } catch (error) {
      console.error('Error checking authentication status:', error)
      return null
    }
  }
}
