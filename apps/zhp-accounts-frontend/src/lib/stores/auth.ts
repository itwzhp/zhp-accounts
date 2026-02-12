import { writable } from 'svelte/store'
import { getAuthAdapter } from '../adapters'

export interface AuthStore {
  isAuthenticated: boolean
  userName: string | null
  token: string | null
  isLoading: boolean
}

function createAuthStore() {
  const { subscribe, update } = writable<AuthStore>({
    isAuthenticated: false,
    userName: null,
    token: null,
    isLoading: false,
  })

  return {
    subscribe,
    // Initialize auth state from stored token/session
    async init() {
      update((state) => ({ ...state, isLoading: true }))
      try {
        const authAdapter = getAuthAdapter()
        const isAuth = await authAdapter.isAuthenticated()
        
        if (isAuth) {
          const token = await authAdapter.getToken()
          
          if (token) {
            update((state) => ({
              ...state,
              isAuthenticated: true,
              token,
            }))
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
      } finally {
        update((state) => ({ ...state, isLoading: false }))
      }
    },
    // Login with auth adapter
    async login() {
      update((state) => ({ ...state, isLoading: true }))
      try {
        const authAdapter = getAuthAdapter()
        const result = await authAdapter.login()
        
        if (result) {
          const token = await authAdapter.getToken()
          update((state) => ({
            ...state,
            isAuthenticated: true,
            userName: result.userName,
            token,
          }))
          return true
        }
        return false
      } catch (error) {
        console.error('Login error:', error)
        return false
      } finally {
        update((state) => ({ ...state, isLoading: false }))
      }
    },
    // Logout with auth adapter
    async logout() {
      update((state) => ({ ...state, isLoading: true }))
      try {
        const authAdapter = getAuthAdapter()
        await authAdapter.logout()
        
        update((state) => ({
          ...state,
          isAuthenticated: false,
          userName: null,
          token: null,
        }))
        return true
      } catch (error) {
        console.error('Logout error:', error)
        return false
      } finally {
        update((state) => ({ ...state, isLoading: false }))
      }
    },
  }
}

export const authStore = createAuthStore()
