import type { Configuration, RedirectRequest, SilentRequest } from '@azure/msal-browser'

/**
 * Get MSAL configuration from environment variables
 */
export function getMsalConfig(): Configuration {
  const clientId = import.meta.env.VITE_MSAL_CLIENT_ID
  const tenantId = import.meta.env.VITE_MSAL_TENANT_ID
  const backendScope = import.meta.env.VITE_MSAL_BACKEND_SCOPE

  if (!clientId || !tenantId || !backendScope) {
    throw new Error(
      'MSAL configuration incomplete. Please set VITE_MSAL_CLIENT_ID, VITE_MSAL_TENANT_ID, and VITE_MSAL_BACKEND_SCOPE environment variables.'
    )
  }

  return {
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: 'sessionStorage',
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message) => {
          if (import.meta.env.DEV) {
            console.log(`[MSAL ${level}]`, message)
          }
        },
        piiLoggingEnabled: false,
        logLevel: import.meta.env.DEV ? 2 : 3, // Verbose in dev, Warning in prod
      },
    },
  }
}

/**
 * Get login request configuration
 */
export function getLoginRequest(): RedirectRequest {
  const backendScope = import.meta.env.VITE_MSAL_BACKEND_SCOPE

  return {
    scopes: ['User.Read', backendScope],
    redirectStartPage: window.location.href,
  }
}

/**
 * Get token request configuration for backend API
 */
export function getTokenRequest(): SilentRequest {
  const backendScope = import.meta.env.VITE_MSAL_BACKEND_SCOPE

  return {
    scopes: [backendScope],
  }
}
