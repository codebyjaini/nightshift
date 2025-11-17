/**
 * SkeletonCard Component
 * Displays a loading skeleton for patient cards
 * Used while data is being fetched
 */
const SkeletonCard = () => {
  return (
    <div 
      className="bg-primary-card rounded-lg p-6 border border-primary-border shadow-card animate-pulse"
      role="status"
      aria-label="Loading patient card"
    >
      {/* Header with badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Name skeleton */}
          <div className="h-6 bg-primary-border rounded w-3/4 mb-2"></div>
          {/* Age skeleton */}
          <div className="h-4 bg-primary-border rounded w-1/2"></div>
        </div>
        {/* Badge skeleton */}
        <div className="h-6 w-20 bg-primary-border rounded-full"></div>
      </div>

      {/* Timestamp skeleton */}
      <div className="h-3 bg-primary-border rounded w-1/3 mb-3"></div>

      {/* Status badge skeleton */}
      <div className="h-6 w-24 bg-primary-border rounded-full"></div>

      <span className="sr-only">Loading patient information...</span>
    </div>
  )
}

export default SkeletonCard
