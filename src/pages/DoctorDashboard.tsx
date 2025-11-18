import { useState } from 'react'
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
import { updateTreatmentStatus, markPatientContacted } from '../services/patientService'
// @ts-ignore - JS module without types
import { signOut } from '../services/authService'

function DoctorDashboard() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'treated' | 'untreated'>('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
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
                loading={updatingStatus}
                contactLoading={contactLoading}
              />
            </>
          )}
        </Modal>
        </div>
      </div>
    </>
  )
}

export default DoctorDashboard
