import PatientCard from './PatientCard'
import Card from '../ui/Card'

/**
 * LoadingSkeleton Component
 * Displays skeleton cards while loading
 */
const LoadingSkeleton = () => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="status"
      aria-live="polite"
      aria-label="Loading patients"
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="p-4 animate-pulse" aria-hidden="true">
          <div className="h-6 bg-primary-border rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-primary-border rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-primary-border rounded w-1/3 mb-3"></div>
          <div className="h-6 bg-primary-border rounded w-24"></div>
        </Card>
      ))}
    </div>
  )
}

/**
 * EmptyState Component
 * Displays message when no patients are found
 */
const EmptyState = ({ filter }) => {
  const getMessage = () => {
    switch (filter) {
      case 'treated':
        return 'No treated patients found.'
      case 'untreated':
        return 'No untreated patients found.'
      default:
        return 'No patients found. Patients will appear here once they submit the triage form.'
    }
  }

  return (
    <Card className="p-12 text-center" role="status" aria-live="polite">
      <div className="max-w-md mx-auto">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No Patients
        </h3>
        <p className="text-text-secondary">
          {getMessage()}
        </p>
      </div>
    </Card>
  )
}

/**
 * PatientList Component
 * Renders a grid of patient cards with loading and empty states
 * 
 * @param {Object} props
 * @param {Array} props.patients - Array of patient objects
 * @param {boolean} props.loading - Loading state
 * @param {string} props.filter - Current filter value
 * @param {Function} props.onPatientClick - Click handler for patient cards
 */
const PatientList = ({ patients, loading, filter, onPatientClick }) => {
  // Show loading skeleton while fetching
  if (loading) {
    return <LoadingSkeleton />
  }

  // Show empty state if no patients
  if (!patients || patients.length === 0) {
    return <EmptyState filter={filter} />
  }

  // Render patient cards in responsive grid
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="list"
      aria-label={`Patient list showing ${patients.length} ${filter === 'all' ? '' : filter} patient${patients.length !== 1 ? 's' : ''}`}
    >
      {patients.map((patient) => (
        <div key={patient.id} role="listitem">
          <PatientCard
            patient={patient}
            onClick={() => onPatientClick(patient)}
          />
        </div>
      ))}
    </div>
  )
}

export default PatientList
