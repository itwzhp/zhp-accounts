import type { BackendPort } from '@/lib/ports/backend'
import type { AuthPort } from '@/lib/ports/auth'
import { RealBackendAdapter } from './real-backend'
import { MockBackendAdapter } from './mock-backend'
import { RealAuthAdapter } from './real-auth'
import { MockAuthAdapter } from './mock-auth'

/**
 * Check if mock mode is enabled via URL parameter
 */
function isMockMode(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  const params = new URLSearchParams(window.location.search)
  return params.get('mock') === 'true'
}

/**
 * Get the API base URL from environment or default
 */
function getApiBaseUrl(): string {
  // Vite environment variable
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'
}

/**
 * Create backend adapter based on mock mode
 */
export function createBackendAdapter(): BackendPort {
  if (isMockMode()) {
    console.info('[Adapters] Using MockBackendAdapter')
    return new MockBackendAdapter()
  }
  console.info('[Adapters] Using RealBackendAdapter')
  return new RealBackendAdapter(getApiBaseUrl())
}

/**
 * Create auth adapter based on mock mode
 */
export function createAuthAdapter(): AuthPort {
  if (isMockMode()) {
    console.info('[Adapters] Using MockAuthAdapter')
    return new MockAuthAdapter()
  }
  console.info('[Adapters] Using RealAuthAdapter')
  return new RealAuthAdapter()
}

// Singleton instances
let backendAdapter: BackendPort | null = null
let authAdapter: AuthPort | null = null

/**
 * Get the backend adapter singleton
 */
export function getBackendAdapter(): BackendPort {
  if (!backendAdapter) {
    backendAdapter = createBackendAdapter()
  }
  return backendAdapter
}

/**
 * Get the auth adapter singleton
 */
export function getAuthAdapter(): AuthPort {
  if (!authAdapter) {
    authAdapter = createAuthAdapter()
  }
  return authAdapter
}

/**
 * Reset adapters (useful for testing)
 */
export function resetAdapters(): void {
  backendAdapter = null
  authAdapter = null
}
