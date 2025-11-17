import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateSymptoms } from '../../utils/validation';

/**
 * TriageStep2 Component - Symptoms Collection
 * Collects patient symptoms with character counter and validation
 * 
 * @param {Object} props
 * @param {Object} props.formData - Current form data with symptoms
 * @param {Function} props.onUpdate - Callback to update form data
 * @param {Function} props.onNext - Callback to proceed to next step
 * @param {Function} props.onBack - Callback to go back to previous step
 */
const TriageStep2 = ({ formData, onUpdate, onNext, onBack }) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Handle textarea blur for validation
  const handleBlur = () => {
    setTouched(true);
    const validation = validateSymptoms(formData.symptoms);
    setError(validation.valid ? '' : validation.error);
  };

  // Handle textarea change
  const handleChange = (value) => {
    onUpdate({ symptoms: value });
    
    // Clear error when user starts typing
    if (touched) {
      const validation = validateSymptoms(value);
      setError(validation.valid ? '' : validation.error);
    }
  };

  // Handle next button click
  const handleNext = () => {
    // Validate symptoms
    const validation = validateSymptoms(formData.symptoms);
    
    setError(validation.valid ? '' : validation.error);
    setTouched(true);
    
    // Only proceed if validation passes
    if (validation.valid) {
      onNext();
    }
  };

  // Check if form is valid
  const isValid = () => {
    const validation = validateSymptoms(formData.symptoms);
    return validation.valid;
  };

  // Calculate character count
  const charCount = formData.symptoms.length;
  const minChars = 10;
  const maxChars = 1000;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Step 2 of 4</span>
          <span className="text-sm font-medium text-accent-primary">Symptoms</span>
        </div>
        <div className="w-full bg-primary-border rounded-full h-2">
          <div 
            className="bg-accent-primary h-2 rounded-full transition-all duration-300"
            style={{ width: '50%' }}
            role="progressbar"
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress: Step 2 of 4"
          />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-primary-card rounded-lg p-6 md:p-8 border border-primary-border shadow-card">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">
          Describe your symptoms
        </h2>
        
        <div className="space-y-6">
          {/* Symptoms Textarea */}
          <div>
            <Input
              type="textarea"
              label="Symptoms"
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched ? error : ''}
              placeholder="Please describe your symptoms in detail. Include when they started, how severe they are, and any other relevant information..."
              required
              rows={8}
            />
            
            {/* Character Counter */}
            <div className="mt-2 flex justify-between items-center text-sm">
              <span className="text-text-muted">
                Minimum {minChars} characters required
              </span>
              <span 
                className={`font-medium ${
                  charCount < minChars 
                    ? 'text-risk-medium' 
                    : charCount > maxChars 
                    ? 'text-risk-critical' 
                    : 'text-accent-primary'
                }`}
              >
                {charCount} / {maxChars}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="secondary"
            size="lg"
            onClick={onBack}
            className="min-w-[120px]"
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={!isValid()}
            className="min-w-[120px]"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <p className="mt-4 text-sm text-text-muted text-center">
        Be as detailed as possible to help medical staff assess your condition accurately.
      </p>
    </div>
  );
};

export default TriageStep2;
