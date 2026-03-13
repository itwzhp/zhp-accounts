const UNIT_STORAGE_PREFIX = 'zhp-accounts-internal-auth:unit:'
const MEMBER_STORAGE_PREFIX = 'zhp-accounts-internal-auth:member:'

const unitMemoryCache = new Map<string, string>()
const memberMemoryCache = new Map<string, string>()

function getUnitStorageKey(unitId: number): string {
  return `${UNIT_STORAGE_PREFIX}${unitId}`
}

function getMemberStorageKey(memberId: string): string {
  return `${MEMBER_STORAGE_PREFIX}${memberId}`
}

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage
}

export function rememberUnitInternalAuthToken(unitIds: number[], token: string): void {
  const uniqueUnitIds = [...new Set(unitIds)]
  const sessionStorage = getSessionStorage()

  uniqueUnitIds.forEach((unitId) => {
    const key = String(unitId)
    unitMemoryCache.set(key, token)
    sessionStorage?.setItem(getUnitStorageKey(unitId), token)
  })
}

export function getUnitInternalAuthToken(unitId: number): string | null {
  const key = String(unitId)
  const cachedToken = unitMemoryCache.get(key)

  if (cachedToken) {
    return cachedToken
  }

  const storedToken = getSessionStorage()?.getItem(getUnitStorageKey(unitId)) ?? null
  if (storedToken) {
    unitMemoryCache.set(key, storedToken)
  }

  return storedToken
}

export function rememberMemberInternalAuthToken(memberIds: string[], token: string): void {
  const uniqueMemberIds = [...new Set(memberIds)]
  const sessionStorage = getSessionStorage()

  uniqueMemberIds.forEach((memberId) => {
    memberMemoryCache.set(memberId, token)
    sessionStorage?.setItem(getMemberStorageKey(memberId), token)
  })
}

export function getMemberInternalAuthToken(memberId: string): string | null {
  const cachedToken = memberMemoryCache.get(memberId)
  if (cachedToken) {
    return cachedToken
  }

  const storedToken = getSessionStorage()?.getItem(getMemberStorageKey(memberId)) ?? null
  if (storedToken) {
    memberMemoryCache.set(memberId, storedToken)
  }

  return storedToken
}