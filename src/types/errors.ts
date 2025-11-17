/**
 * Extended error type with user-friendly message and retry flag
 */
export interface ExtendedError extends Error {
  userMessage?: string
  canRetry?: boolean
}

/**
 * Service error response type
 */
export interface ServiceError {
  message: string
  userMessage?: string
  canRetry?: boolean
  code?: string
}
