import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePatients from '../hooks/usePatients'
import useRealtimePatients from '../hooks/useRealtimePatients'
import type { Patient } from '../hooks/usePatients'
import type { ServiceError } from '../types/errors'
// @ts-ignore - JSX component without types
import Header from '../components/layout/Header'
// @ts-ignore - JSX component without types
import BackButton from '../components/ui/BackButton'
import FilterControls from '../components/doctor/FilterControls'
import PatientList from '../components/doctor/PatientList'
// @ts-ignore - JSX component without types
import PatientDetail from '../components/doctor/PatientDetail'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
// @ts-ignore - JSX component without types
import NetworkErrorBanner from '../components/ui/NetworkErrorBanner'
import { updateTreatmentStatus, markPatientContacted, deletePatient } from '../services/patientService'
// @ts-ignore - JS module without types
import { signOut } from '../services/authService'

function DoctorDashboard() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'treated' | 'untreated'>('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
  const { patients: initialPatients, loading, error, refetch } = usePatients(filter)
  
  // Use real-time hook to keep patient list updated
  const patients = useRealtimePatients(initialPatients)

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient)
    setUpdateError(null)
  }

  const handleCloseModal = () => {
    setSelectedPatient(null)
    setUpdateError(null)
  }

  const handleMarkTreated = async () => {
    if (!selectedPatient) return
    
    setUpdatingStatus(true)
    setUpdateError(null)
    
    const { data, error } = await updateTreatmentStatus(selectedPatient.id, true)
    
    if (error) {
      const serviceError = error as ServiceError
      setUpdateError(serviceError.userMessage || serviceError.message || 'Failed to update treatment status. Please try again.')
      setUpdatingStatus(false)
      return
    }
    
    // Optimistically update the selected patient
    if (data) {
      setSelectedPatient(data)
    }
    
    setUpdatingStatus(false)
    // The real-time hook will update the patient list automatically
  }

  const handleMarkNotTreated = async () => {
    if (!selectedPatient) return
    
    setUpdatingStatus(true)
    setUpdateError(null)
    
    const { data, error } = await updateTreatmentStatus(selectedPatient.id, false)
    
    if (error) {
      const serviceError = error as ServiceError
      setUpdateError(serviceError.userMessage || serviceError.message || 'Failed to update treatment status. Please try again.')
      setUpdatingStatus(false)
      return
    }
    
    // Optimistically update the selected patient
    if (data) {
      setSelectedPatient(data)
    }
    
    setUpdatingStatus(false)
    // The real-time hook will update the patient list automatically
  }

  const handleMarkContacted = async () => {
    if (!selectedPatient) return
    
    setContactLoading(true)
    setUpdateError(null)
    
    // TODO: Get actual doctor ID from auth context
    const doctorId = 'temp-doctor-id'
    
    const { data, error } = await markPatientContacted(selectedPatient.id, doctorId)
    
    if (error) {
      const serviceError = error as ServiceError
      setUpdateError(serviceError.userMessage || serviceError.message || 'Failed to mark patient as contacted. Please try again.')
      setContactLoading(false)
      return
    }
    
    // Optimistically update the selected patient
    if (data) {
      setSelectedPatient(data)
    }
    
    setContactLoading(false)
    // The real-time hook will update the patient list automatically
  }

  const handleFilterChange = (newFilter: 'all' | 'treated' | 'untreated') => {
    setFilter(newFilter)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
    setDeleteError(null)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPatient) return
    
    setDeleteLoading(true)
    setDeleteError(null)
    
    const { data, error } = await deletePatient(selectedPatient.id)
    
    if (error) {
      const serviceError = error as ServiceError
      setDeleteError(serviceError.userMessage || serviceError.message || 'Failed to delete patient record. Please try again.')
      setDeleteLoading(false)
      return
    }
    
    // Show success confirmation
    if (data) {
      setShowDeleteSuccess(true)
      
      // Wait 1.5 seconds, then close modals
      setTimeout(() => {
        setShowDeleteSuccess(false)
        setShowDeleteConfirm(false)
        setSelectedPatient(null)
        setDeleteError(null)
        setDeleteLoading(false)
      }, 1500)
    } else {
      setDeleteLoading(false)
    }
  }

  // Prevent Escape key from closing confirmation dialog during deletion
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showDeleteConfirm && !deleteLoading) {
        setShowDeleteConfirm(false)
        setDeleteError(null)
      } else if (e.key === 'Escape' && showDeleteConfirm && deleteLoading) {
        // Prevent default Escape behavior during deletion
        e.preventDefault()
        e.stopPropagation()
      }
    }

    if (showDeleteConfirm) {
      document.addEventListener('keydown', handleEscape, true)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape, true)
    }
  }, [showDeleteConfirm, deleteLoading])

  return (
    <>
      <NetworkErrorBanner />
      <Header />
      <div className="min-h-screen bg-primary-bg text-text-primary p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Doctor Dashboard
          </h1>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={refetch}
              disabled={loading}
              aria-label="Refresh patient list"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </Button>
          </div>
        </header>

        {/* Error message */}
        {error && (
          <div 
            className="mb-6 p-4 bg-risk-critical/10 border border-risk-critical rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            <p className="text-risk-critical">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={refetch}
              className="mt-2"
              aria-label="Retry loading patients"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Filter controls */}
        <nav className="mb-6" aria-label="Patient filters">
          <FilterControls
            activeFilter={filter}
            onFilterChange={handleFilterChange}
          />
        </nav>

        {/* Patient list */}
        <main id="main-content" role="main">
          <PatientList
            patients={patients}
            loading={loading}
            filter={filter}
            onPatientClick={handlePatientClick}
          />
        </main>

        {/* Patient detail modal */}
        <Modal
          isOpen={selectedPatient !== null}
          onClose={handleCloseModal}
          title="Patient Details"
          size="lg"
        >
          {selectedPatient && (
            <>
              {updateError && (
                <div className="mb-4 p-3 bg-risk-critical/10 border border-risk-critical rounded-lg">
                  <p className="text-risk-critical text-sm">{updateError}</p>
                </div>
              )}
              <PatientDetail
                patient={selectedPatient}
                onMarkTreated={handleMarkTreated}
                onMarkNotTreated={handleMarkNotTreated}
                onMarkContacted={handleMarkContacted}
                onClose={handleCloseModal}
                onDelete={handleDeleteClick}
                loading={updatingStatus}
                contactLoading={contactLoading}
                deleteLoading={deleteLoading}
              />
            </>
          )}
        </Modal>

        {/* Delete confirmation dialog (nested modal) */}
        {showDeleteConfirm && selectedPatient && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
            onClick={(e) => {
              // Prevent closing during deletion
              if (!deleteLoading && e.target === e.currentTarget) {
                setShowDeleteConfirm(false)
                setDeleteError(null)
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <div
              className="bg-primary-card border border-primary-border rounded-lg shadow-modal w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary-border">
                <h2 
                  id="delete-confirm-title"
                  className="text-xl font-semibold text-text-primary"
                >
                  Confirm Deletion
                </h2>
                {!deleteLoading && (
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteError(null)
                    }}
                    className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-md hover:bg-primary-border focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    aria-label="Close confirmation dialog"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {showDeleteSuccess ? (
                  // Success confirmation
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-text-primary font-medium">
                      Patient record deleted successfully
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Warning icon */}
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-risk-critical/10 mb-4">
                      <svg
                        className="h-6 w-6 text-risk-critical"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>

                    {/* Confirmation message */}
                    <div className="text-center mb-4">
                      <p className="text-text-primary font-medium mb-2">
                        Are you sure you want to delete this patient record?
                      </p>
                      <p className="text-text-secondary text-sm mb-2">
                        Patient: <span className="font-semibold text-text-primary">{selectedPatient.name}</span>
                      </p>
                      <p className="text-risk-critical text-sm font-medium">
                        This action cannot be undone.
                      </p>
                    </div>

                    {/* Error display */}
                    {deleteError && (
                      <div className="mb-4 p-3 bg-risk-critical/10 border border-risk-critical rounded-lg">
                        <p className="text-risk-critical text-sm">{deleteError}</p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeleteError(null)
                        }}
                        disabled={deleteLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeleteConfirm}
                        disabled={deleteLoading}
                        className="bg-risk-critical hover:bg-risk-critical/90 text-white"
                      >
                        {deleteLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}

export default DoctorDashboard
