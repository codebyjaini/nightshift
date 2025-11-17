/// <reference types="vite/client" />

// Patient types
declare module '*/usePatients' {
  export interface Patient {
    id: string
    name: string
    age: number
    symptoms: string
    pain_level: 'Low' | 'Medium' | 'High'
    risk_level: 'Low' | 'Medium' | 'Critical'
    image: string | null
    treated: boolean
    created_at: string
  }

  export interface UsePatientsReturn {
    patients: Patient[]
    loading: boolean
    error: string | null
    refetch: () => Promise<void>
  }

  export function usePatients(filter?: 'all' | 'treated' | 'untreated'): UsePatientsReturn
  export default usePatients
}

// Doctor components
declare module '*/FilterControls' {
  import React from 'react'

  export interface FilterControlsProps {
    activeFilter: 'all' | 'treated' | 'untreated'
    onFilterChange: (filter: 'all' | 'treated' | 'untreated') => void
  }

  const FilterControls: React.FC<FilterControlsProps>
  export default FilterControls
}

declare module '*/PatientCard' {
  import React from 'react'
  import { Patient } from '*/usePatients'

  export interface PatientCardProps {
    patient: Patient
    onClick: () => void
  }

  const PatientCard: React.FC<PatientCardProps>
  export default PatientCard
}

declare module '*/PatientList' {
  import React from 'react'
  import { Patient } from '*/usePatients'

  export interface PatientListProps {
    patients: Patient[]
    loading: boolean
    filter: 'all' | 'treated' | 'untreated'
    onPatientClick: (patient: Patient) => void
  }

  const PatientList: React.FC<PatientListProps>
  export default PatientList
}
