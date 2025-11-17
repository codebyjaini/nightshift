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
