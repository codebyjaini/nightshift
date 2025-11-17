/**
 * Error Handler Utility
 * Centralized error handling and user-friendly error message mapping
 */

/**
 * Error types for categorization
 */
export const ErrorType = {
  NETWORK: 'network',
  DATABASE: 'database',
  VALIDATION: 'validation',
  UPLOAD: 'upload',
  UNKNOWN: 'unknown',
}

/**
 * Detect error type from error object
 * @param {Error|Object} error - Error object
 * @returns {string} Error type
 */
export const detectErrorType = (error) => {
  if (!error) return ErrorType.UNKNOWN

  const errorMessage = error.message || error.toString()

  // Network errors
  if (
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('Network request failed') ||
    errorMessage.includes('NetworkError') ||
    errorMessage.includes('fetch') ||
    error.name === 'NetworkError'
  ) {
    return ErrorType.NETWORK
  }

  // Database errors
  if (
    errorMessage.includes('duplicate key') ||
    errorMessage.includes('foreign key') ||
    errorMessage.includes('not null') ||
    errorMessage.includes('violates') ||
    error.code?.startsWith('23') // PostgreSQL constraint violations
  ) {
    return ErrorType.DATABASE
  }

  // Validation errors
  if (
    errorMessage.includes('validation') ||
    errorMessage.includes('invalid') ||
    errorMessage.includes('required')
  ) {
    return ErrorType.VALIDATION
  }

  // Upload errors
  if (
    errorMessage.includes('upload') ||
    errorMessage.includes('file') ||
    errorMessage.includes('storage')
  ) {
    return ErrorType.UPLOAD
  }

  return ErrorType.UNKNOWN
}

/**
 * Map technical errors to user-friendly messages
 * @param {Error|Object} error - Error object
 * @param {string} context - Context where error occurred (e.g., 'patient creation', 'image upload')
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyMessage = (error, context = '') => {
  if (!error) return 'An unexpected error occurred. Please try again.'

  const errorMessage = error.message || error.toString()
  const errorType = detectErrorType(error)

  // Network errors
  if (errorType === ErrorType.NETWORK) {
    return 'Unable to connect to the server. Please check your internet connection and try again.'
  }

  // Database errors
  if (errorType === ErrorType.DATABASE) {
    if (errorMessage.includes('duplicate key')) {
      return 'This record already exists in the system.'
    }
    if (errorMessage.includes('foreign key')) {
      return 'Related data not found. Please refresh and try again.'
    }
    if (errorMessage.includes('not null')) {
      return 'Required information is missing. Please check all fields.'
    }
    return 'A database error occurred. Please try again or contact support if the issue persists.'
  }

  // Validation errors
  if (errorType === ErrorType.VALIDATION) {
    return errorMessage // Validation errors are usually already user-friendly
  }

  // Upload errors
  if (errorType === ErrorType.UPLOAD) {
    if (errorMessage.includes('size')) {
      return 'File size exceeds the maximum allowed limit (5MB).'
    }
    if (errorMessage.includes('type') || errorMessage.includes('format')) {
      return 'Invalid file format. Please upload a JPEG, PNG, or WebP image.'
    }
    return 'Failed to upload image. Please try again with a different file.'
  }

  // Context-specific messages
  if (context) {
    return `Failed to ${context}. Please try again.`
  }

  // Default message
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Check if error is retryable
 * @param {Error|Object} error - Error object
 * @returns {boolean} Whether the error is retryable
 */
export const isRetryable = (error) => {
  const errorType = detectErrorType(error)
  
  // Network errors are always retryable
  if (errorType === ErrorType.NETWORK) return true
  
  // Upload errors are retryable
  if (errorType === ErrorType.UPLOAD) return true
  
  // Database errors might be retryable (except constraint violations)
  if (errorType === ErrorType.DATABASE) {
    const errorMessage = error.message || error.toString()
    if (errorMessage.includes('duplicate key')) return false
    return true
  }
  
  // Validation errors are not retryable (user needs to fix input)
  if (errorType === ErrorType.VALIDATION) return false
  
  // Unknown errors are retryable
  return true
}

/**
 * Handle error with logging and user-friendly message
 * @param {Error|Object} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {Object} Error info with user message and retry flag
 */
export const handleError = (error, context = '') => {
  // Log error for debugging
  console.error(`Error in ${context}:`, error)

  const userMessage = getUserFriendlyMessage(error, context)
  const canRetry = isRetryable(error)
  const errorType = detectErrorType(error)

  return {
    message: userMessage,
    canRetry,
    errorType,
    originalError: error,
  }
}

/**
 * Check if user is online
 * @returns {boolean} Whether user has network connection
 */
export const isOnline = () => {
  return navigator.onLine
}

/**
 * Wait for network connection
 * @param {number} timeout - Maximum time to wait in milliseconds
 * @returns {Promise<boolean>} Whether connection was established
 */
export const waitForConnection = (timeout = 5000) => {
  return new Promise((resolve) => {
    if (isOnline()) {
      resolve(true)
      return
    }

    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', onlineHandler)
      resolve(false)
    }, timeout)

    const onlineHandler = () => {
      clearTimeout(timeoutId)
      window.removeEventListener('online', onlineHandler)
      resolve(true)
    }

    window.addEventListener('online', onlineHandler)
  })
}

export default {
  ErrorType,
  detectErrorType,
  getUserFriendlyMessage,
  isRetryable,
  handleError,
  isOnline,
  waitForConnection,
}
