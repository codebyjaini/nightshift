import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ServiceError } from '../types/errors';
// @ts-ignore - JSX component without types
import Header from '../components/layout/Header';
// @ts-ignore - JSX component without types
import BackButton from '../components/ui/BackButton';
// @ts-ignore - JSX component without types
import TriageStep1 from '../components/patient/TriageStep1';
// @ts-ignore - JSX component without types
import TriageStep2 from '../components/patient/TriageStep2';
// @ts-ignore - JSX component without types
import TriageStep3 from '../components/patient/TriageStep3';
// @ts-ignore - JSX component without types
import TriageStep4 from '../components/patient/TriageStep4';
// @ts-ignore - JSX component without types
import ReviewSubmit from '../components/patient/ReviewSubmit';
// @ts-ignore - JSX component without types
import SuccessScreen from '../components/patient/SuccessScreen';
// @ts-ignore - JSX component without types
import ErrorMessage from '../components/ui/ErrorMessage';
// @ts-ignore - JSX component without types
import NetworkErrorBanner from '../components/ui/NetworkErrorBanner';
// @ts-ignore - JS module without types
import { calculateRiskLevel } from '../services/riskCalculator';
// @ts-ignore - JS module without types
import { createPatient } from '../services/patientService';
// @ts-ignore - JS module without types
import { useImageUpload } from '../hooks/useImageUpload';

interface FormData {
  name: string;
  age: string | number;
  symptoms: string;
  painLevel: string;
  imageFile: File | null;
  imagePreview: string | null;
}

/**
 * PatientTriage Page Component
 * Multi-step triage form for patient information collection
 * Manages form state and navigation between steps
 */
function PatientTriage() {
  const navigate = useNavigate();
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  
  // Current step state (1-5: steps 1-4, review, success)
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    symptoms: '',
    painLevel: '',
    imageFile: null,
    imagePreview: null
  });

  // Submission state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedPatientName, setSubmittedPatientName] = useState<string>('');

  /**
   * Update form data
   * @param updates - Partial form data to update
   */
  const handleFormUpdate = (updates: Partial<FormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  /**
   * Navigate to next step
   */
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  /**
   * Navigate to previous step
   */
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  /**
   * Navigate to a specific step (for editing from review)
   */
  const handleGoToStep = (step: number) => {
    setCurrentStep(step);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Validate and convert age - ensure it's a valid number
      const ageNumber = Number(formData.age);
      
      // Log form data for debugging
      console.log('Form data before submission:', {
        name: formData.name,
        age: formData.age,
        ageNumber: ageNumber,
        symptoms: formData.symptoms,
        painLevel: formData.painLevel
      });

      // Basic validation
      if (isNaN(ageNumber)) {
        throw new Error('Age must be a valid number');
      }

      // Calculate risk level
      const riskLevel = calculateRiskLevel(formData.symptoms, formData.painLevel);

      // Upload image if provided
      let imageUrl: string | null = null;
      if (formData.imageFile) {
        // Generate a temporary ID for the image upload
        const tempId = `temp-${Date.now()}`;
        const { url, error: uploadError } = await uploadImage(formData.imageFile, tempId);
        
        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError}`);
        }
        
        imageUrl = url;
      }

      // Create patient record with validated data
      const patientData = {
        name: String(formData.name).trim(),
        age: ageNumber,
        symptoms: String(formData.symptoms).trim(),
        pain_level: formData.painLevel as 'Low' | 'Medium' | 'High',
        risk_level: riskLevel as 'Low' | 'Medium' | 'Critical',
        image: imageUrl,
      };

      // Log the data being sent (for debugging)
      console.log('Submitting patient data:', patientData);

      const { error } = await createPatient(patientData);

      if (error) {
        const serviceError = error as ServiceError;
        console.error('Supabase error:', serviceError);
        throw new Error(serviceError.userMessage || serviceError.message || 'Failed to submit patient information');
      }

      // Success - store patient name and navigate to success screen
      setSubmittedPatientName(formData.name);
      setCurrentStep(6); // Success screen
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Reset form and start over
   */
  const handleReset = () => {
    setFormData({
      name: '',
      age: '',
      symptoms: '',
      painLevel: '',
      imageFile: null,
      imagePreview: null
    });
    setCurrentStep(1);
    setSubmitError(null);
    setSubmittedPatientName('');
  };

  /**
   * Return to landing page
   */
  const handleReturnHome = () => {
    navigate('/');
  };

  /**
   * Retry submission after error
   */
  const handleRetry = () => {
    setSubmitError(null);
    handleSubmit();
  };

  return (
    <>
      <NetworkErrorBanner />
      {/* @ts-ignore - JSX component without types */}
      <Header />
      <div className="min-h-screen bg-primary-bg text-text-primary py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          {/* @ts-ignore - JSX component without types */}
          <BackButton />
        </div>
        
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-accent-cyan to-accent-purple bg-clip-text text-transparent">
            Patient Triage Form
          </h1>
          <p className="text-text-secondary">
            Please provide your information so we can assess your condition
          </p>
        </header>

        {/* Step Content */}
        <main 
          id="main-content"
          className="mb-8"
          role="main"
          aria-label={`Triage form step ${currentStep} of ${currentStep === 6 ? 'complete' : '5'}`}
        >
          {currentStep === 1 && (
            <TriageStep1
              formData={formData}
              onUpdate={handleFormUpdate}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 2 && (
            <TriageStep2
              formData={formData}
              onUpdate={handleFormUpdate}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && (
            <TriageStep3
              formData={formData}
              onUpdate={handleFormUpdate}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 4 && (
            <TriageStep4
              formData={formData}
              onUpdate={handleFormUpdate}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <>
              {submitError && (
                <div className="mb-6">
                  <ErrorMessage 
                    message={submitError}
                    onRetry={handleRetry}
                  />
                </div>
              )}
              {imageUploading && (
                <div className="mb-6 p-4 bg-primary-card border border-primary-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg 
                      className="animate-spin h-5 w-5 text-accent-primary" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="text-text-primary">Uploading image...</span>
                  </div>
                </div>
              )}
              <ReviewSubmit
                formData={formData}
                onEdit={handleGoToStep}
                onSubmit={handleSubmit}
                loading={submitting || imageUploading}
                onBack={handleBack}
              />
            </>
          )}

          {currentStep === 6 && (
            <SuccessScreen
              patientName={submittedPatientName}
              onReset={handleReset}
              onReturnHome={handleReturnHome}
            />
          )}
        </main>
        </div>
      </div>
    </>
  );
}

export default PatientTriage;
