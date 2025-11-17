import { useState, useEffect } from 'react'
import { subscribeToPatients, unsubscribeFromPatients } from '../services/patientService'

/**
 * Custom hook to manage real-time patient updates
 * Subscribes to Supabase real-time changes and maintains sorted patient list
 * @param {Array} initialPatients - Initial patient data from usePatients
 * @returns {Array} patients - Real-time updated patient list
 */
export const useRealtimePatients = (initialPatients) => {
  const [patients, setPatients] = useState(initialPatients)

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

  // Update patients when initialPatients changes
  useEffect(() => {
    setPatients(initialPatients)
  }, [initialPatients])

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = subscribeToPatients((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload

      if (eventType === 'INSERT') {
        // Add new patient to the list and maintain sorting
        setPatients((prev) => sortPatientsByRisk([newRecord, ...prev]))
      } else if (eventType === 'UPDATE') {
        // Update existing patient in the list
        setPatients((prev) => {
          const updated = prev.map((patient) =>
            patient.id === newRecord.id ? newRecord : patient
          )
          return sortPatientsByRisk(updated)
        })
      } else if (eventType === 'DELETE') {
        // Remove deleted patient from the list
        setPatients((prev) => prev.filter((patient) => patient.id !== oldRecord.id))
      }
    })

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        unsubscribeFromPatients(subscription)
      }
    }
  }, [])

  return patients
}

export default useRealtimePatients
