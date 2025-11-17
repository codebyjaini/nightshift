import React from 'react'
import { Patient } from '../../hooks/usePatients'

export interface PatientCardProps {
  patient: Patient
  onClick: () => void
}

declare const PatientCard: React.FC<PatientCardProps>

export default PatientCard
