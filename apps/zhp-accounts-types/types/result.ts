/**
 * Result type for operations that can succeed or fail
 */
export type Result<T> = Success<T> | Failure

export interface Success<T> {
  success: true
  data: T
}

export interface Failure {
  success: false
  error: string
}

/**
 * Create a successful result
 */
export function ok<T>(data: T): Result<T> {
  return { success: true, data }
}

/**
 * Create a failed result
 */
export function err<T>(error: string): Result<T> {
  return { success: false, error }
}
