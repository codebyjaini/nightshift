import { CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

/**
 * SuccessScreen Component - Confirmation after successful triage submission
 * Displays confirmation message and options to submit another case or return home
 * 
 * @param {Object} props
 * @param {string} props.patientName - Name of the patient who submitted
 * @param {Function} props.onReset - Callback to reset form and submit another case
 * @param {Function} props.onReturnHome - Callback to return to landing page
 */
const SuccessScreen = ({ patientName, onReset, onReturnHome }) => {
  return (
    <div className="w-full max-w-2xl mx-auto" role="status" aria-live="polite">
      <div className="bg-primary-card rounded-lg p-8 md:p-12 border border-primary-border shadow-card text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6 animate-scale-in">
          <div className="rounded-full bg-accent-primary/10 p-4" aria-hidden="true">
            <CheckCircle 
              className="w-16 h-16 text-accent-primary" 
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-3xl font-bold mb-4 text-text-primary">
          Thank you, {patientName}!
        </h2>
        
        <p className="text-lg text-text-secondary mb-8 max-w-md mx-auto">
          Your information has been submitted successfully. A doctor will review your case shortly and provide appropriate care.
        </p>

        {/* Additional Info */}
        <div className="bg-primary-bg border border-primary-border rounded-lg p-4 mb-8 max-w-md mx-auto" role="note">
          <p className="text-sm text-text-muted">
            Please remain in the waiting area. You will be called when a doctor is ready to see you.
          </p>
        </div>

        {/* Action Buttons */}
        <nav className="flex flex-col sm:flex-row gap-4 justify-center" aria-label="Next actions">
          <Button
            variant="primary"
            size="lg"
            onClick={onReset}
            className="min-w-[200px]"
            aria-label="Submit another patient case"
          >
            Submit Another Case
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={onReturnHome}
            className="min-w-[200px]"
            aria-label="Return to home page"
          >
            Return to Home
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default SuccessScreen;
