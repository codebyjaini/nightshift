/**
 * Patient data structure
 */
export interface PatientData {
  name: string;
  age: number;
  symptoms: string;
  pain_level: 'Low' | 'Medium' | 'High';
  risk_level: 'Low' | 'Medium' | 'Critical';
  image: string | null;
}

/**
 * Patient record from database
 */
export interface Patient extends PatientData {
  id: string;
  treated: boolean;
  contacted: boolean;
  contacted_at: string | null;
  created_at: string;
}

/**
 * Service response structure
 */
export interface ServiceResponse<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Create a new patient record
 */
export function createPatient(patientData: PatientData): Promise<ServiceResponse<Patient>>;

/**
 * Fetch all patients with optional filtering
 */
export function getPatients(filter?: 'all' | 'treated' | 'untreated'): Promise<ServiceResponse<Patient[]>>;

/**
 * Update patient treatment status
 */
export function updateTreatmentStatus(patientId: string, treated: boolean): Promise<ServiceResponse<Patient>>;

/**
 * Mark patient as contacted and log to contact history
 */
export function markPatientContacted(patientId: string, doctorId: string): Promise<ServiceResponse<Patient>>;

/**
 * Subscribe to real-time changes on the patients table
 */
export function subscribeToPatients(callback: (payload: any) => void): any;

/**
 * Unsubscribe from real-time changes
 */
export function unsubscribeFromPatients(subscription: any): Promise<void>;

/**
 * Patient service object
 */
export const patientService: {
  createPatient: typeof createPatient;
  getPatients: typeof getPatients;
  updateTreatmentStatus: typeof updateTreatmentStatus;
  markPatientContacted: typeof markPatientContacted;
  subscribeToPatients: typeof subscribeToPatients;
  unsubscribeFromPatients: typeof unsubscribeFromPatients;
};

export default patientService;
