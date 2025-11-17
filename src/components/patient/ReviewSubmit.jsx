import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * ReviewSubmit Component - Review and Submit Patient Triage Form
 * Displays all entered data in read-only format with edit options
 * Handles form submission with loading state
 * 
 * @param {Object} props
 * @param {Object} props.formData - Complete form data
 * @param {string} props.formData.name - Patient name
 * @param {string|number} props.formData.age - Patient age
 * @param {string} props.formData.symptoms - Symptom description
 * @param {string} props.formData.painLevel - Pain level (Low, Medium, High)
 * @param {File|null} props.formData.imageFile - Image file if uploaded
 * @param {string|null} props.formData.imagePreview - Image preview URL
 * @param {Function} props.onEdit - Callback to edit a specific step (receives step number)
 * @param {Function} props.onSubmit - Callback to submit the form
 * @param {boolean} props.loading - Loading state during submission
 * @param {Function} props.onBack - Callback to go back to previous step
 */
const ReviewSubmit = ({ formData, onEdit, onSubmit, loading, onBack }) => {
  // Map pain level to badge variant
  const getPainLevelVariant = (painLevel) => {
    switch (painLevel) {
      case 'High':
        return 'critical';
      case 'Medium':
        return 'medium';
      case 'Low':
        return 'low';
      default:
        return 'low';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Review & Submit</span>
          <span className="text-sm font-medium text-accent-primary">Final Step</span>
        </div>
        <div className="w-full bg-primary-border rounded-full h-2">
          <div 
            className="bg-accent-primary h-2 rounded-full transition-all duration-300"
            style={{ width: '100%' }}
            role="progressbar"
            aria-valuenow={100}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress: Review and Submit"
          />
        </div>
      </div>

      {/* Review Card */}
      <div className="bg-primary-card rounded-lg p-6 md:p-8 border border-primary-border shadow-card">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">
          Review Your Information
        </h2>
        
        <p className="text-text-secondary mb-8">
          Please review your information before submitting. You can edit any section if needed.
        </p>

        <div className="space-y-6" role="list" aria-label="Review sections">
          {/* Basic Info Section */}
          <section className="border border-primary-border rounded-lg p-5 bg-primary-bg" role="listitem" aria-labelledby="basic-info-heading">
            <div className="flex items-start justify-between mb-4">
              <h3 id="basic-info-heading" className="text-lg font-semibold text-text-primary">Basic Information</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(1)}
                disabled={loading}
                aria-label="Edit basic information"
              >
                Edit
              </Button>
            </div>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-text-muted">Name:</dt>
                <dd className="text-base text-text-primary font-medium">{formData.name}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Age:</dt>
                <dd className="text-base text-text-primary font-medium">{formData.age} years</dd>
              </div>
            </dl>
          </section>

          {/* Symptoms Section */}
          <section className="border border-primary-border rounded-lg p-5 bg-primary-bg" role="listitem" aria-labelledby="symptoms-heading">
            <div className="flex items-start justify-between mb-4">
              <h3 id="symptoms-heading" className="text-lg font-semibold text-text-primary">Symptoms</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(2)}
                disabled={loading}
                aria-label="Edit symptoms"
              >
                Edit
              </Button>
            </div>
            <div>
              <p className="text-base text-text-primary whitespace-pre-wrap">{formData.symptoms}</p>
            </div>
          </section>

          {/* Pain Level Section */}
          <section className="border border-primary-border rounded-lg p-5 bg-primary-bg" role="listitem" aria-labelledby="pain-level-heading">
            <div className="flex items-start justify-between mb-4">
              <h3 id="pain-level-heading" className="text-lg font-semibold text-text-primary">Pain Level</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(3)}
                disabled={loading}
                aria-label="Edit pain level"
              >
                Edit
              </Button>
            </div>
            <div>
              <Badge variant={getPainLevelVariant(formData.painLevel)} size="md">
                {formData.painLevel}
              </Badge>
            </div>
          </section>

          {/* Image Section */}
          <section className="border border-primary-border rounded-lg p-5 bg-primary-bg" role="listitem" aria-labelledby="image-heading">
            <div className="flex items-start justify-between mb-4">
              <h3 id="image-heading" className="text-lg font-semibold text-text-primary">Image</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(4)}
                disabled={loading}
                aria-label="Edit image"
              >
                Edit
              </Button>
            </div>
            <div>
              {formData.imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={formData.imagePreview}
                    alt="Preview of medical condition image to be submitted"
                    className="max-w-full h-auto max-h-64 rounded-lg border border-primary-border object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                  <p className="text-sm text-text-muted">
                    {formData.imageFile?.name || 'Image uploaded'}
                  </p>
                </div>
              ) : (
                <p className="text-text-muted italic">No image uploaded</p>
              )}
            </div>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-between" role="group" aria-label="Form navigation">
          <Button
            variant="secondary"
            size="lg"
            onClick={onBack}
            disabled={loading}
            className="sm:min-w-[120px]"
            aria-label="Go back to previous step"
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={onSubmit}
            loading={loading}
            disabled={loading}
            className="sm:min-w-[160px]"
            aria-label={loading ? 'Submitting your information' : 'Submit triage form'}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>

      {/* Privacy Notice */}
      <p className="mt-4 text-sm text-text-muted text-center">
        By submitting, you confirm that the information provided is accurate and consent to its use for medical triage purposes.
      </p>
    </div>
  );
};

export default ReviewSubmit;
