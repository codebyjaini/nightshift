import React from 'react'
import { Patient } from '../../hooks/usePatients'

export interface PatientListProps {
  patients: Patient[]
  loading: boolean
  filter: 'all' | 'treated' | 'untreated'
  onPatientClick: (patient: Patient) => void
}

declare const PatientList: React.FC<PatientListProps>

export default PatientList
