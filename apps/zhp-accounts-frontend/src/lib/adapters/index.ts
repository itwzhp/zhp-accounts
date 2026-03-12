import type { BackendQueryPort } from '@/lib/ports/backend-querying'
import type { BackendCommandPort } from '@/lib/ports/backend-commands'
import type { AuthPort } from '@/lib/ports/auth'
import { RealBackendAdapter } from './real-backend'
import { MockBackendAdapter } from './mock-backend'
import { RealAuthAdapter } from './real-auth'
import { MockAuthAdapter } from './mock-auth'
import { MockBackendCommandsAdapter } from './mock-backend-commands'
import { RealBackendCommandsAdapter } from './real-backend-commands'

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
  return import.meta.env.VITE_API_BASE_URL
}

/**
 * Create backend adapter based on mock mode
 */
function createBackendAdapter(): BackendQueryPort {
  if (isMockMode()) {
    console.info('[Adapters] Using MockBackendAdapter')
    return new MockBackendAdapter()
  }
  console.info('[Adapters] Using RealBackendAdapter')
  return new RealBackendAdapter(getApiBaseUrl(), getAuthAdapter())
}

/**
 * Create auth adapter based on mock mode
 */
function createAuthAdapter(): AuthPort {
  if (isMockMode()) {
    console.info('[Adapters] Using MockAuthAdapter')
    return new MockAuthAdapter()
  }
  console.info('[Adapters] Using RealAuthAdapter')
  return new RealAuthAdapter()
}

/**
 * Create backend commands adapter based on mock mode
 */
function createBackendCommandsAdapter(): BackendCommandPort {
  if (isMockMode()) {
    console.info('[Adapters] Using MockBackendCommandsAdapter')
    return new MockBackendCommandsAdapter()
  }
  console.info('[Adapters] Using RealBackendCommandsAdapter')
  return new RealBackendCommandsAdapter(getApiBaseUrl(), getAuthAdapter())
}

// Singleton instances
let backendAdapter: BackendQueryPort | null = null
let authAdapter: AuthPort | null = null
let backendCommandsAdapter: BackendCommandPort | null = null

/**
 * Get the backend adapter singleton
 */
export function getBackendAdapter(): BackendQueryPort {
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
 * Get the backend commands adapter singleton
 */
export function getBackendCommandsAdapter(): BackendCommandPort {
  if (!backendCommandsAdapter) {
    backendCommandsAdapter = createBackendCommandsAdapter()
  }
  return backendCommandsAdapter
}

/**
 * Reset adapters (useful for testing)
 */
export function resetAdapters(): void {
  backendAdapter = null
  authAdapter = null
  backendCommandsAdapter = null
}
