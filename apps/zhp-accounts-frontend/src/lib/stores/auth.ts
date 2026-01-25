import { writable, derived, get } from 'svelte/store'
import type { ZhpAccount } from 'zhp-accounts-types'

const STORAGE_KEY = 'zhp-auth'

interface AuthState {
  token: string | null
  account: ZhpAccount | null
  expiresAt: number | null
}

interface StoredAuthState {
  token: string
  account: ZhpAccount
  expiresAt: number
}

/**
 * Load auth state from sessionStorage
 */
function loadFromStorage(): AuthState {
  if (typeof window === 'undefined') {
    return { token: null, account: null, expiresAt: null }
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return { token: null, account: null, expiresAt: null }
    }

    const parsed: StoredAuthState = JSON.parse(stored)
    
    // Check if token has expired
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(STORAGE_KEY)
      return { token: null, account: null, expiresAt: null }
    }

    return {
      token: parsed.token,
      account: parsed.account,
      expiresAt: parsed.expiresAt
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY)
    return { token: null, account: null, expiresAt: null }
  }
}

/**
 * Save auth state to sessionStorage
 */
function saveToStorage(state: AuthState): void {
  if (typeof window === 'undefined') {
    return
  }

  if (state.token && state.account && state.expiresAt) {
    const toStore: StoredAuthState = {
      token: state.token,
      account: state.account,
      expiresAt: state.expiresAt
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
  } else {
    sessionStorage.removeItem(STORAGE_KEY)
  }
}

/**
 * Create the auth store with sessionStorage persistence
 */
function createAuthStore() {
  const initialState = loadFromStorage()
  const { subscribe, set, update } = writable<AuthState>(initialState)

  return {
    subscribe,

    /**
     * Set authentication data after successful login
     */
    setAuth(token: string, account: ZhpAccount, expiresAt: number): void {
      const state: AuthState = { token, account, expiresAt }
      saveToStorage(state)
      set(state)
    },

    /**
     * Clear authentication data on logout
     */
    clearAuth(): void {
      const state: AuthState = { token: null, account: null, expiresAt: null }
      saveToStorage(state)
      set(state)
    },

    /**
     * Update account information
     */
    updateAccount(account: ZhpAccount): void {
      update(state => {
        const newState = { ...state, account }
        saveToStorage(newState)
        return newState
      })
    },

    /**
     * Get current token synchronously
     */
    getToken(): string | null {
      return get({ subscribe }).token
    },

    /**
     * Get current account synchronously
     */
    getAccount(): ZhpAccount | null {
      return get({ subscribe }).account
    }
  }
}

/**
 * Main auth store instance
 */
export const authStore = createAuthStore()

/**
 * Derived store for checking if user is authenticated
 */
export const isAuthenticated = derived(
  authStore,
  $auth => $auth.token !== null && $auth.expiresAt !== null && Date.now() < $auth.expiresAt
)

/**
 * Derived store for current user account
 */
export const currentAccount = derived(
  authStore,
  $auth => $auth.account
)

/**
 * Derived store for current user display name
 */
export const currentUserName = derived(
  currentAccount,
  $account => $account ? `${$account.mail}` : null
)
