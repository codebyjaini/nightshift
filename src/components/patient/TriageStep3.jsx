import { useState } from 'react';
import Button from '../ui/Button';

/**
 * TriageStep3 Component - Pain Level Selection
 * Allows patient to select pain level with visual card interface
 * 
 * @param {Object} props
 * @param {Object} props.formData - Current form data with painLevel
 * @param {Function} props.onUpdate - Callback to update form data
 * @param {Function} props.onNext - Callback to proceed to next step
 * @param {Function} props.onBack - Callback to go back to previous step
 */
const TriageStep3 = ({ formData, onUpdate, onNext, onBack }) => {
  const [selectedPain, setSelectedPain] = useState(formData.painLevel || '');

  // Pain level options with icons and descriptions
  const painLevels = [
    {
      level: 'Low',
      color: 'risk-low',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Mild discomfort, manageable',
      examples: 'Minor aches, slight discomfort'
    },
    {
      level: 'Medium',
      color: 'risk-medium',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Moderate pain, noticeable',
      examples: 'Persistent pain, affects activities'
    },
    {
      level: 'High',
      color: 'risk-critical',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: 'Severe pain, urgent attention',
      examples: 'Intense pain, difficult to bear'
    }
  ];

  // Handle pain level selection
  const handleSelect = (level) => {
    setSelectedPain(level);
    onUpdate({ painLevel: level });
  };

  // Handle next button click
  const handleNext = () => {
    if (selectedPain) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Step 3 of 4</span>
          <span className="text-sm font-medium text-accent-primary">Pain Level</span>
        </div>
        <div className="w-full bg-primary-border rounded-full h-2">
          <div 
            className="bg-accent-primary h-2 rounded-full transition-all duration-300"
            style={{ width: '75%' }}
            role="progressbar"
            aria-valuenow={75}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress: Step 3 of 4"
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-8 text-text-primary text-center">
        What is your current pain level?
      </h2>

      {/* Pain Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {painLevels.map((pain) => {
          const isSelected = selectedPain === pain.level;
          const borderColorClass = isSelected 
            ? pain.level === 'Low' 
              ? 'border-risk-low' 
              : pain.level === 'Medium' 
              ? 'border-risk-medium' 
              : 'border-risk-critical'
            : 'border-primary-border';
          
          const iconColorClass = pain.level === 'Low' 
            ? 'text-risk-low' 
            : pain.level === 'Medium' 
            ? 'text-risk-medium' 
            : 'text-risk-critical';

          return (
            <button
              key={pain.level}
              onClick={() => handleSelect(pain.level)}
              className={`
                relative bg-primary-card rounded-lg p-6 border-2 
                transition-all duration-300 cursor-pointer
                min-h-[160px] md:min-h-[180px]
                focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-primary-bg
                ${borderColorClass}
                ${isSelected ? 'scale-105' : 'opacity-60 hover:opacity-80 hover:scale-[1.02]'}
              `}
              style={{
                boxShadow: isSelected 
                  ? pain.level === 'Low'
                    ? '0 0 20px rgba(16, 185, 129, 0.3)'
                    : pain.level === 'Medium'
                    ? '0 0 20px rgba(245, 158, 11, 0.3)'
                    : '0 0 20px rgba(239, 68, 68, 0.3)'
                  : undefined
              }}
              aria-pressed={isSelected}
              aria-label={`Select ${pain.level} pain level`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <svg className="w-6 h-6 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className={`flex justify-center mb-4 ${iconColorClass}`}>
                {pain.icon}
              </div>

              {/* Level Name */}
              <h3 className="text-xl font-bold mb-2 text-text-primary">
                {pain.level}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary mb-2">
                {pain.description}
              </p>

              {/* Examples */}
              <p className="text-xs text-text-muted italic">
                {pain.examples}
              </p>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
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
          disabled={!selectedPain}
          className="min-w-[120px]"
        >
          Next
        </Button>
      </div>

      {/* Help Text */}
      <p className="mt-6 text-sm text-text-muted text-center">
        Select the option that best describes your current pain level
      </p>
    </div>
  );
};

export default TriageStep3;
