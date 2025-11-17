import type { Patient } from './usePatients'

/**
 * Custom hook to manage real-time patient updates
 * Subscribes to Supabase real-time changes and maintains sorted patient list
 * @param initialPatients - Initial patient data from usePatients
 * @returns Real-time updated patient list
 */
export function useRealtimePatients(initialPatients: Patient[]): Patient[]

export default useRealtimePatients
