import { useState, useEffect } from 'react'
import { getPatients } from '../services/patientService'

/**
 * Custom hook to fetch and manage patient data
 * @param {string} filter - Filter option: 'all', 'treated', or 'untreated'
 * @returns {Object} { patients, loading, error, refetch }
 */
export const usePatients = (filter = 'all') => {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Sort patients by risk level and creation time
   * Critical first, then Medium, then Low
   * Within each risk level, sort by created_at descending (newest first)
   */
  const sortPatientsByRisk = (patientList) => {
    const riskOrder = { Critical: 0, Medium: 1, Low: 2 }
    
    return [...patientList].sort((a, b) => {
      // First, sort by risk level
      const riskDiff = riskOrder[a.risk_level] - riskOrder[b.risk_level]
      if (riskDiff !== 0) return riskDiff
      
      // Within same risk level, sort by created_at descending (newest first)
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }

  /**
   * Fetch patients from Supabase
   */
  const fetchPatients = async () => {
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await getPatients(filter)

    if (fetchError) {
      setError(fetchError.userMessage || fetchError.message || 'Failed to fetch patients')
      setPatients([])
    } else {
      setPatients(sortPatientsByRisk(data || []))
    }

    setLoading(false)
  }

  // Fetch patients when filter changes
  useEffect(() => {
    fetchPatients()
  }, [filter])

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients,
  }
}

export default usePatients
