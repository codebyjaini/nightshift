/**
 * Form Validation Utilities
 * Provides validation functions for patient triage form fields
 */

/**
 * Validate patient name
 * @param {string} name - Patient name
 * @returns {Object} Validation result with valid flag and error message
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: 'Name is required'
    };
  }
  
  if (name.length < 2) {
    return {
      valid: false,
      error: 'Name must be at least 2 characters'
    };
  }
  
  if (name.length > 100) {
    return {
      valid: false,
      error: 'Name must not exceed 100 characters'
    };
  }
  
  return {
    valid: true,
    error: null
  };
};

/**
 * Validate patient age
 * @param {number|string} age - Patient age
 * @returns {Object} Validation result with valid flag and error message
 */
export const validateAge = (age) => {
  const ageNum = Number(age);
  
  if (age === '' || age === null || age === undefined) {
    return {
      valid: false,
      error: 'Age is required'
    };
  }
  
  if (isNaN(ageNum)) {
    return {
      valid: false,
      error: 'Age must be a valid number'
    };
  }
  
  if (ageNum < 0) {
    return {
      valid: false,
      error: 'Age must be 0 or greater'
    };
  }
  
  if (ageNum > 150) {
    return {
      valid: false,
      error: 'Age must not exceed 150'
    };
  }
  
  return {
    valid: true,
    error: null
  };
};

/**
 * Validate patient symptoms
 * @param {string} symptoms - Patient symptoms description
 * @returns {Object} Validation result with valid flag and error message
 */
export const validateSymptoms = (symptoms) => {
  if (!symptoms || symptoms.trim().length === 0) {
    return {
      valid: false,
      error: 'Symptoms are required'
    };
  }
  
  if (symptoms.length < 10) {
    return {
      valid: false,
      error: 'Symptoms must be at least 10 characters'
    };
  }
  
  if (symptoms.length > 1000) {
    return {
      valid: false,
      error: 'Symptoms must not exceed 1000 characters'
    };
  }
  
  return {
    valid: true,
    error: null
  };
};

/**
 * Validate all form fields
 * @param {Object} formData - Form data object with name, age, and symptoms
 * @returns {Object} Validation result with valid flag and errors object
 */
export const validateForm = (formData) => {
  const nameValidation = validateName(formData.name);
  const ageValidation = validateAge(formData.age);
  const symptomsValidation = validateSymptoms(formData.symptoms);
  
  const errors = {};
  
  if (!nameValidation.valid) {
    errors.name = nameValidation.error;
  }
  
  if (!ageValidation.valid) {
    errors.age = ageValidation.error;
  }
  
  if (!symptomsValidation.valid) {
    errors.symptoms = symptomsValidation.error;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
