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
  errorCode: string
}
