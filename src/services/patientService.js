import { supabase } from './supabaseClient'
import { handleError } from '../utils/errorHandler'

/**
 * Patient Service
 * Handles all CRUD operations for patient records in Supabase
 */

/**
 * Create a new patient record
 * @param {Object} patientData - Patient information
 * @param {string} patientData.name - Patient name (2-100 characters)
 * @param {number} patientData.age - Patient age (0-150)
 * @param {string} patientData.symptoms - Symptom description (10-1000 characters)
 * @param {string} patientData.pain_level - Pain level: 'Low', 'Medium', or 'High'
 * @param {string} patientData.risk_level - Risk level: 'Low', 'Medium', or 'Critical'
 * @param {string|null} patientData.image - Image URL or null
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const createPatient = async (patientData) => {
  try {
    // Prepare data for insertion
    const insertData = {
      name: String(patientData.name || '').trim(),
      age: Number(patientData.age),
      symptoms: String(patientData.symptoms || '').trim(),
      pain_level: String(patientData.pain_level),
      risk_level: String(patientData.risk_level),
      image: patientData.image || null,
      treated: false,
    };

    // Log the data being inserted (for debugging)
    console.log('Inserting patient data to Supabase:', insertData);

    const { data, error } = await supabase
      .from('patients')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error);
      const errorInfo = handleError(error, 'create patient record')
      return { data: null, error: { ...error, userMessage: errorInfo.message, canRetry: errorInfo.canRetry } }
    }

    console.log('Patient created successfully:', data);
    return { data, error: null }
  } catch (error) {
    console.error('Exception in createPatient:', error);
    const errorInfo = handleError(error, 'create patient record')
    return { data: null, error: { message: errorInfo.message, canRetry: errorInfo.canRetry } }
  }
}

/**
 * Fetch all patients with optional filtering
 * @param {string} filter - Filter option: 'all', 'treated', or 'untreated'
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const getPatients = async (filter = 'all') => {
  try {
    let query = supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filter based on treatment status
    if (filter === 'treated') {
      query = query.eq('treated', true)
    } else if (filter === 'untreated') {
      query = query.eq('treated', false)
    }

    const { data, error } = await query

    if (error) {
      const errorInfo = handleError(error, 'fetch patient list')
      return { data: null, error: { ...error, userMessage: errorInfo.message, canRetry: errorInfo.canRetry } }
    }

    return { data, error: null }
  } catch (error) {
    const errorInfo = handleError(error, 'fetch patient list')
    return { data: null, error: { message: errorInfo.message, canRetry: errorInfo.canRetry } }
  }
}

/**
 * Update patient treatment status
 * @param {string} patientId - Patient UUID
 * @param {boolean} treated - Treatment status
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const updateTreatmentStatus = async (patientId, treated) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update({ treated })
      .eq('id', patientId)
      .select()
      .single()

    if (error) {
      const errorInfo = handleError(error, 'update treatment status')
      return { data: null, error: { ...error, userMessage: errorInfo.message, canRetry: errorInfo.canRetry } }
    }

    return { data, error: null }
  } catch (error) {
    const errorInfo = handleError(error, 'update treatment status')
    return { data: null, error: { message: errorInfo.message, canRetry: errorInfo.canRetry } }
  }
}

/**
 * Mark patient as contacted and log to contact history
 * @param {string} patientId - Patient UUID
 * @param {string} doctorId - Doctor UUID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const markPatientContacted = async (patientId, doctorId) => {
  try {
    // Start a transaction-like operation
    const now = new Date().toISOString();
    
    // 1. Update patients table
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .update({ 
        contacted: true, 
        contacted_at: now 
      })
      .eq('id', patientId)
      .select()
      .single();

    if (patientError) {
      const errorInfo = handleError(patientError, 'mark patient as contacted');
      return { 
        data: null, 
        error: { 
          ...patientError, 
          userMessage: errorInfo.message, 
          canRetry: errorInfo.canRetry 
        } 
      };
    }

    // 2. Insert into contact_history
    const { error: historyError } = await supabase
      .from('contact_history')
      .insert([{
        patient_id: patientId,
        doctor_id: doctorId,
        contacted_at: now
      }]);

    if (historyError) {
      console.error('Failed to log contact history:', historyError);
      // Don't fail the entire operation if history logging fails
      // The patient is still marked as contacted
    }

    return { data: patientData, error: null };
  } catch (error) {
    const errorInfo = handleError(error, 'mark patient as contacted');
    return { 
      data: null, 
      error: { 
        message: errorInfo.message, 
        canRetry: errorInfo.canRetry 
      } 
    };
  }
};

/**
 * Delete a patient record permanently
 * @param {string} patientId - Patient UUID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deletePatient = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientId)
      .select()
      .single()

    if (error) {
      const errorInfo = handleError(error, 'delete patient record')
      return { data: null, error: { ...error, userMessage: errorInfo.message, canRetry: errorInfo.canRetry } }
    }

    return { data: { id: data.id }, error: null }
  } catch (error) {
    const errorInfo = handleError(error, 'delete patient record')
    return { data: null, error: { message: errorInfo.message, canRetry: errorInfo.canRetry } }
  }
}

/**
 * Subscribe to real-time changes on the patients table
 * @param {Function} callback - Callback function to handle real-time events
 * @returns {Object} Supabase subscription object
 */
export const subscribeToPatients = (callback) => {
  try {
    const subscription = supabase
      .channel('patients-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients',
        },
        (payload) => {
          callback(payload)
        }
      )
      .subscribe()

    return subscription
  } catch (error) {
    console.error('Error subscribing to patients:', error)
    return null
  }
}

/**
 * Unsubscribe from real-time changes
 * @param {Object} subscription - Supabase subscription object
 */
export const unsubscribeFromPatients = async (subscription) => {
  if (subscription) {
    await supabase.removeChannel(subscription)
  }
}

// Export all functions as a service object
export const patientService = {
  createPatient,
  getPatients,
  updateTreatmentStatus,
  markPatientContacted,
  deletePatient,
  subscribeToPatients,
  unsubscribeFromPatients,
}

export default patientService
