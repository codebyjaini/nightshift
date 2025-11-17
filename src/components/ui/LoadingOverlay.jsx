import LoadingSpinner from './LoadingSpinner'

/**
 * LoadingOverlay Component
 * Full-screen loading overlay with spinner and optional message
 * Used for initial data loading or blocking operations
 * 
 * @param {Object} props
 * @param {string} props.message - Optional loading message
 * @param {boolean} props.transparent - Whether to use transparent background
 */
const LoadingOverlay = ({ 
  message = 'Loading...', 
  transparent = false 
}) => {
  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        ${transparent ? 'bg-primary-bg/50' : 'bg-primary-bg'}
      `}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="text-center">
        <LoadingSpinner size="xl" />
        {message && (
          <p className="mt-4 text-lg text-text-secondary">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default LoadingOverlay
