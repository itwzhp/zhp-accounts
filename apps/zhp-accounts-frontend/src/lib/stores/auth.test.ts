import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { get } from 'svelte/store'
import { authStore, isAuthenticated, currentAccount } from './auth'
import type { ZhpAccount } from 'zhp-accounts-types'

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { store = {} })
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
})

describe('authStore', () => {
  const mockAccount: ZhpAccount = {
    mail: 'test@zhp.net.pl',
    upn: 'test@zhp.net.pl',
    membershipNumber: 'AA123456',
    region: 'mazowieckie',
    district: 'Warszawa',
    isAdmin: false
  }

  beforeEach(() => {
    mockSessionStorage.clear()
    authStore.clearAuth()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('setAuth', () => {
    it('should store authentication data', () => {
      const expiresAt = Date.now() + 3600 * 1000
      authStore.setAuth('test-token', mockAccount, expiresAt)
      
      expect(authStore.getToken()).toBe('test-token')
      expect(authStore.getAccount()).toEqual(mockAccount)
    })

    it('should persist to sessionStorage', () => {
      const expiresAt = Date.now() + 3600 * 1000
      authStore.setAuth('test-token', mockAccount, expiresAt)
      
      expect(mockSessionStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('clearAuth', () => {
    it('should clear authentication data', () => {
      const expiresAt = Date.now() + 3600 * 1000
      authStore.setAuth('test-token', mockAccount, expiresAt)
      authStore.clearAuth()
      
      expect(authStore.getToken()).toBeNull()
      expect(authStore.getAccount()).toBeNull()
    })
  })

  describe('getToken', () => {
    it('should return null when not authenticated', () => {
      expect(authStore.getToken()).toBeNull()
    })

    it('should return token when authenticated', () => {
      const expiresAt = Date.now() + 3600 * 1000
      authStore.setAuth('test-token', mockAccount, expiresAt)
      
      expect(authStore.getToken()).toBe('test-token')
    })
  })
})

describe('isAuthenticated', () => {
  beforeEach(() => {
    mockSessionStorage.clear()
    authStore.clearAuth()
  })

  it('should be false when not authenticated', () => {
    expect(get(isAuthenticated)).toBe(false)
  })

  it('should be true when authenticated with valid token', () => {
    const expiresAt = Date.now() + 3600 * 1000
    authStore.setAuth('test-token', {
      mail: 'test@zhp.net.pl',
      upn: 'test@zhp.net.pl',
      membershipNumber: 'AA123456',
      region: 'mazowieckie'
    }, expiresAt)
    
    expect(get(isAuthenticated)).toBe(true)
  })
})

describe('currentAccount', () => {
  beforeEach(() => {
    mockSessionStorage.clear()
    authStore.clearAuth()
  })

  it('should be null when not authenticated', () => {
    expect(get(currentAccount)).toBeNull()
  })
})
