/// <reference types="svelte" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Backend API Base URL
   * @example
   * - Development: http://localhost:3000/api
   * - Production: https://api.yourdomain.com/api
   */
  readonly VITE_API_BASE_URL: string

  /**
   * Microsoft Entra ID (Azure AD) - Client ID from App Registration
   * Get from Azure Portal > App Registration > Application (client) ID
   * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  readonly VITE_MSAL_CLIENT_ID: string

  /**
   * Microsoft Entra ID - Tenant ID
   * Get from Azure Portal > App Registration > Directory (tenant) ID
   * @example "tenant-id-here" or use "common" for multi-tenant
   */
  readonly VITE_MSAL_TENANT_ID: string

  /**
   * OAuth Scope for backend API access
   * Format: api://your-backend-app-id/.default
   * Get the backend app ID from Azure App Registration for your backend API
   * @example "api://a1b2c3d4-e5f6-7890-abcd-ef1234567890/.default"
   */
  readonly VITE_MSAL_BACKEND_SCOPE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
