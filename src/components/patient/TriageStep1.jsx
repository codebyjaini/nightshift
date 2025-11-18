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
    age: '',
    phone: '',
    gender: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    age: false,
    phone: false,
    gender: false
  });

  // Validate phone number
  const validatePhone = (phone) => {
    if (!phone || phone.trim() === '') {
      return { valid: false, error: 'Phone number is required' };
    }
    // Basic phone validation - at least 10 digits
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return { valid: false, error: 'Please enter a valid phone number' };
    }
    return { valid: true, error: '' };
  };

  // Validate gender
  const validateGender = (gender) => {
    if (!gender || gender.trim() === '') {
      return { valid: false, error: 'Please select a gender' };
    }
    return { valid: true, error: '' };
  };

  // Handle field blur for validation
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    if (field === 'name') {
      const validation = validateName(formData.name);
      setErrors(prev => ({ ...prev, name: validation.valid ? '' : validation.error }));
    } else if (field === 'age') {
      const validation = validateAge(formData.age);
      setErrors(prev => ({ ...prev, age: validation.valid ? '' : validation.error }));
    } else if (field === 'phone') {
      const validation = validatePhone(formData.phone);
      setErrors(prev => ({ ...prev, phone: validation.valid ? '' : validation.error }));
    } else if (field === 'gender') {
      const validation = validateGender(formData.gender);
      setErrors(prev => ({ ...prev, gender: validation.valid ? '' : validation.error }));
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
      } else if (field === 'phone') {
        const validation = validatePhone(value);
        setErrors(prev => ({ ...prev, phone: validation.valid ? '' : validation.error }));
      } else if (field === 'gender') {
        const validation = validateGender(value);
        setErrors(prev => ({ ...prev, gender: validation.valid ? '' : validation.error }));
      }
    }
  };

  // Handle next button click
  const handleNext = () => {
    // Validate all fields
    const nameValidation = validateName(formData.name);
    const ageValidation = validateAge(formData.age);
    const phoneValidation = validatePhone(formData.phone);
    const genderValidation = validateGender(formData.gender);
    
    const newErrors = {
      name: nameValidation.valid ? '' : nameValidation.error,
      age: ageValidation.valid ? '' : ageValidation.error,
      phone: phoneValidation.valid ? '' : phoneValidation.error,
      gender: genderValidation.valid ? '' : genderValidation.error
    };
    
    setErrors(newErrors);
    setTouched({ name: true, age: true, phone: true, gender: true });
    
    // Only proceed if all validations pass
    if (nameValidation.valid && ageValidation.valid && phoneValidation.valid && genderValidation.valid) {
      onNext();
    }
  };

  // Check if form is valid
  const isValid = () => {
    const nameValidation = validateName(formData.name);
    const ageValidation = validateAge(formData.age);
    const phoneValidation = validatePhone(formData.phone);
    const genderValidation = validateGender(formData.gender);
    return nameValidation.valid && ageValidation.valid && phoneValidation.valid && genderValidation.valid;
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

          {/* Phone Input */}
          <Input
            type="tel"
            label="Phone Number"
            name="phone"
            value={formData.phone || ''}
            onChange={(value) => handleChange('phone', value)}
            onBlur={() => handleBlur('phone')}
            error={touched.phone ? errors.phone : ''}
            placeholder="(555) 123-4567"
            required
            autoComplete="tel"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />

          {/* Gender Select */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-text-secondary" htmlFor="gender">
              Gender
              <span className="text-risk-critical ml-1" aria-label="required">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <select
                id="gender"
                name="gender"
                value={formData.gender || ''}
                onChange={(e) => handleChange('gender', e.target.value)}
                onBlur={() => handleBlur('gender')}
                className="w-full px-4 py-3.5 min-h-[48px] bg-primary-navy/50 border-2 rounded-xl text-text-primary transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border-primary-border hover:border-accent-cyan/30 pl-12"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            {touched.gender && errors.gender && (
              <p className="text-sm text-risk-critical mt-1">{errors.gender}</p>
            )}
          </div>
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
