import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateName, validateAge } from '../../utils/validation';

/**
 * TriageStep1 Component - Basic Information Collection
 * Collects patient name and age with real-time validation
 * 
 * @param {Object} props
 * @param {Object} props.formData - Current form data with name and age
 * @param {Function} props.onUpdate - Callback to update form data
 * @param {Function} props.onNext - Callback to proceed to next step
 */
const TriageStep1 = ({ formData, onUpdate, onNext }) => {
  const [errors, setErrors] = useState({
    name: '',
    age: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    age: false
  });

  // Handle field blur for validation
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (field === 'name') {
      const validation = validateName(formData.name);
      setErrors(prev => ({ ...prev, name: validation.valid ? '' : validation.error }));
    } else if (field === 'age') {
      const validation = validateAge(formData.age);
      setErrors(prev => ({ ...prev, age: validation.valid ? '' : validation.error }));
    }
  };

  // Handle field change
  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
    
    // Clear error when user starts typing
    if (touched[field]) {
      if (field === 'name') {
        const validation = validateName(value);
        setErrors(prev => ({ ...prev, name: validation.valid ? '' : validation.error }));
      } else if (field === 'age') {
        const validation = validateAge(value);
        setErrors(prev => ({ ...prev, age: validation.valid ? '' : validation.error }));
      }
    }
  };

  // Handle next button click
  const handleNext = () => {
    // Validate all fields
    const nameValidation = validateName(formData.name);
    const ageValidation = validateAge(formData.age);
    
    const newErrors = {
      name: nameValidation.valid ? '' : nameValidation.error,
      age: ageValidation.valid ? '' : ageValidation.error
    };
    
    setErrors(newErrors);
    setTouched({ name: true, age: true });
    
    // Only proceed if all validations pass
    if (nameValidation.valid && ageValidation.valid) {
      onNext();
    }
  };

  // Check if form is valid
  const isValid = () => {
    const nameValidation = validateName(formData.name);
    const ageValidation = validateAge(formData.age);
    return nameValidation.valid && ageValidation.valid;
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-text-secondary">Step 1 of 4</span>
          <span className="text-sm font-semibold bg-gradient-to-r from-accent-cyan to-accent-teal bg-clip-text text-transparent">
            Basic Information
          </span>
        </div>
        <div className="relative w-full bg-primary-navy/50 rounded-full h-3 overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-accent-cyan to-accent-teal h-3 rounded-full transition-all duration-500 shadow-glow"
            style={{ width: '25%' }}
            role="progressbar"
            aria-valuenow={25}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress: Step 1 of 4"
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="relative bg-primary-card rounded-2xl p-8 md:p-10 border border-primary-border shadow-card backdrop-blur-sm">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-accent-cyan/10 to-transparent rounded-full blur-3xl -z-10" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-accent-cyan to-accent-teal rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
            Let's start with your basic information
          </h2>
        </div>
        
        <p className="text-text-muted mb-8">
          Please provide your name and age so we can properly assess your condition.
        </p>
        
        <div className="space-y-6">
          {/* Name Input */}
          <Input
            type="text"
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(value) => handleChange('name', value)}
            onBlur={() => handleBlur('name')}
            error={touched.name ? errors.name : ''}
            placeholder="John Doe"
            required
            autoComplete="name"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          {/* Age Input */}
          <Input
            type="number"
            label="Age"
            name="age"
            value={formData.age}
            onChange={(value) => handleChange('age', value)}
            onBlur={() => handleBlur('age')}
            error={touched.age ? errors.age : ''}
            placeholder="25"
            required
            min={0}
            max={150}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-end">
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!isValid()}
            className="min-w-[160px]"
          >
            Continue
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted">
        <svg className="w-4 h-4 text-accent-cyan" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>Your information is secure and HIPAA compliant</span>
      </div>
    </div>
  );
};

export default TriageStep1;
