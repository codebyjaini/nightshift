import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { Phone } from 'lucide-react'

/**
 * Format timestamp to relative time (e.g., "5 minutes ago")
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Relative time string
 */
const formatRelativeTime = (timestamp) => {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInSeconds = Math.floor((now - past) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
}

/**
 * PatientCard Component
 * Displays a patient summary card with name, age, risk level, and treatment status
 * 
 * @param {Object} props
 * @param {Object} props.patient - Patient data object
 * @param {Function} props.onClick - Click handler for card
 */
const PatientCard = ({ patient, onClick }) => {
  const { name, age, phone, risk_level, treated, contacted, created_at } = patient

  return (
    <Card
      hoverable
      onClick={onClick}
      className="relative cursor-pointer p-4 md:p-4 min-h-[120px]"
      aria-label={`Patient ${name}, age ${age}, ${risk_level} risk, ${treated ? 'treated' : 'not treated'}. Click to view details.`}
    >
      {/* Risk badge in top-right corner */}
      <div className="absolute top-3 right-3" aria-hidden="true">
        <Badge variant={risk_level.toLowerCase()} size="sm">
          {risk_level}
        </Badge>
      </div>

      {/* Patient information */}
      <div className="pr-20">
        <h3 className="text-xl font-semibold text-text-primary mb-1">
          {name}
        </h3>
        <p className="text-text-secondary text-sm mb-2">
          Age: {age}
        </p>

        {/* Phone number display */}
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-4 h-4 text-accent-cyan" aria-hidden="true" />
          <a 
            href={`tel:${phone}`}
            className="text-sm text-accent-cyan hover:text-accent-teal transition-colors"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Call ${name} at ${phone}`}
          >
            {phone}
          </a>
        </div>

        <p className="text-text-muted text-xs mb-3">
          <time dateTime={created_at}>{formatRelativeTime(created_at)}</time>
        </p>

        {/* Status badges */}
        <div className="flex gap-2 flex-wrap">
          {/* Treatment status badge */}
          <Badge
            variant={treated ? 'treated' : 'untreated'}
            size="sm"
          >
            {treated ? 'Treated' : 'Not Treated'}
          </Badge>

          {/* Contact status badge */}
          <Badge
            variant={contacted ? 'success' : 'warning'}
            size="sm"
          >
            {contacted ? 'Contacted' : 'Pending'}
          </Badge>
        </div>
      </div>
    </Card>
  )
}

export default PatientCard
