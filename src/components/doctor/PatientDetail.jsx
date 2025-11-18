import { useState } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Phone, Check, Copy } from 'lucide-react'

/**
 * Format timestamp to readable format
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date and time
 */
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * PatientDetail Component
 * Displays full patient information in a modal view
 * 
 * @param {Object} props
 * @param {Object} props.patient - Patient data object
 * @param {Function} props.onMarkTreated - Handler for marking patient as treated
 * @param {Function} props.onMarkNotTreated - Handler for marking patient as not treated
 * @param {Function} props.onMarkContacted - Handler for marking patient as contacted
 * @param {Function} props.onClose - Handler for closing the detail view
 * @param {boolean} props.loading - Loading state for treatment status update
 * @param {boolean} props.contactLoading - Loading state for contact status update
 */
const PatientDetail = ({ 
  patient, 
  onMarkTreated, 
  onMarkNotTreated, 
  onMarkContacted,
  onClose,
  loading = false,
  contactLoading = false
}) => {
  const { 
    name, 
    age, 
    phone,
    symptoms, 
    pain_level, 
    risk_level, 
    image, 
    treated,
    contacted,
    created_at 
  } = patient

  const [copied, setCopied] = useState(false)

  const handleCallPatient = () => {
    if (!phone) return

    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      // On mobile, open dialer
      window.location.href = `tel:${phone}`
    } else {
      // On desktop, copy to clipboard
      navigator.clipboard.writeText(phone).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(err => {
        console.error('Failed to copy:', err)
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-text-primary mb-2" id="patient-name">
            {name}
          </h3>
          <p className="text-text-secondary text-lg">
            Age: <span aria-label={`${age} years old`}>{age} years</span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Patient status indicators">
          <Badge variant={risk_level.toLowerCase()} size="md">
            {risk_level} Risk
          </Badge>
          <Badge variant={treated ? 'treated' : 'untreated'} size="md">
            {treated ? 'Treated' : 'Not Treated'}
          </Badge>
          <Badge variant={contacted ? 'success' : 'warning'} size="md">
            {contacted ? 'Contacted' : 'Pending'}
          </Badge>
        </div>
      </div>

      {/* Submission Timestamp */}
      <div className="border-t border-primary-border pt-4">
        <p className="text-text-muted text-sm">
          Submitted: <time dateTime={created_at}>{formatTimestamp(created_at)}</time>
        </p>
      </div>

      {/* Contact Information Section */}
      <section aria-labelledby="contact-heading">
        <h4 id="contact-heading" className="text-lg font-semibold text-text-primary mb-3">
          Contact Information
        </h4>
        <div className="bg-primary-bg p-4 rounded-lg border border-primary-border">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-accent-cyan" aria-hidden="true" />
              <div>
                <p className="text-sm text-text-muted">Phone Number</p>
                <p className="text-lg font-semibold text-text-primary">{phone || 'Not provided'}</p>
              </div>
            </div>
            {phone && (
              <Button
                variant="primary"
                onClick={handleCallPatient}
                className="flex items-center gap-2"
                aria-label={`Call ${name}`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    Call Patient
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Pain Level Section */}
      <section aria-labelledby="pain-level-heading">
        <h4 id="pain-level-heading" className="text-lg font-semibold text-text-primary mb-2">
          Pain Level
        </h4>
        <div className="flex items-center gap-2">
          <Badge 
            variant={
              pain_level === 'High' ? 'critical' : 
              pain_level === 'Medium' ? 'medium' : 
              'low'
            }
            size="md"
          >
            {pain_level}
          </Badge>
        </div>
      </section>

      {/* Symptoms Section */}
      <section aria-labelledby="symptoms-heading">
        <h4 id="symptoms-heading" className="text-lg font-semibold text-text-primary mb-2">
          Symptoms
        </h4>
        <div className="bg-primary-bg p-4 rounded-lg border border-primary-border">
          <p className="text-text-secondary whitespace-pre-wrap">
            {symptoms}
          </p>
        </div>
      </section>

      {/* Image Section */}
      {image && (
        <section aria-labelledby="image-heading">
          <h4 id="image-heading" className="text-lg font-semibold text-text-primary mb-2">
            Uploaded Image
          </h4>
          <div className="bg-primary-bg p-4 rounded-lg border border-primary-border">
            <img
              src={image}
              alt={`Medical condition image submitted by patient ${name}`}
              className="max-w-full h-auto rounded-md"
              style={{ maxWidth: '800px' }}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML = '<p class="text-text-muted" role="alert">Image failed to load</p>'
              }}
            />
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <div 
        className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-primary-border"
        role="group"
        aria-label="Patient actions"
      >
        {treated ? (
          <Button
            variant="secondary"
            onClick={onMarkNotTreated}
            disabled={loading || contactLoading}
            loading={loading}
            className="flex-1"
            aria-label={`Mark ${name} as not treated`}
          >
            Mark as Not Treated
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={onMarkTreated}
            disabled={loading || contactLoading}
            loading={loading}
            className="flex-1"
            aria-label={`Mark ${name} as treated`}
          >
            Mark as Treated
          </Button>
        )}
        {!contacted && (
          <Button
            variant="secondary"
            onClick={onMarkContacted}
            disabled={contactLoading || loading}
            loading={contactLoading}
            className="flex-1"
            aria-label={`Mark ${name} as contacted`}
          >
            <Check className="w-4 h-4 mr-2" aria-hidden="true" />
            Mark as Contacted
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={loading || contactLoading}
          className="flex-1"
          aria-label="Close patient details"
        >
          Close
        </Button>
      </div>
    </div>
  )
}

export default PatientDetail
