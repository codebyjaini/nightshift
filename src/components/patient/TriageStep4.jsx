import { useState, useRef } from 'react';
import Button from '../ui/Button';
import { imageService } from '../../services/imageService';

/**
 * TriageStep4 Component - Image Upload
 * Allows patient to optionally upload an image with drag-and-drop support
 * 
 * @param {Object} props
 * @param {Object} props.formData - Current form data with imageFile and imagePreview
 * @param {Function} props.onUpdate - Callback to update form data
 * @param {Function} props.onNext - Callback to proceed to next step
 * @param {Function} props.onBack - Callback to go back to previous step
 */
const TriageStep4 = ({ formData, onUpdate, onNext, onBack }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate the image
    const validation = imageService.validateImage(file);
    
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    // Clear any previous errors
    setValidationError(null);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    // Update form data
    onUpdate({
      imageFile: file,
      imagePreview: previewUrl
    });
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle remove image
  const handleRemoveImage = () => {
    // Revoke the preview URL to free memory
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }

    // Clear form data
    onUpdate({
      imageFile: null,
      imagePreview: null
    });

    // Clear validation error
    setValidationError(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle skip button
  const handleSkip = () => {
    // Clear any selected image
    if (formData.imageFile) {
      handleRemoveImage();
    }
    onNext();
  };

  // Handle next button
  const handleNext = () => {
    onNext();
  };

  // Trigger file input click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-secondary">Step 4 of 4</span>
          <span className="text-sm font-medium text-accent-primary">Image Upload (Optional)</span>
        </div>
        <div className="w-full bg-primary-border rounded-full h-2">
          <div 
            className="bg-accent-primary h-2 rounded-full transition-all duration-300"
            style={{ width: '100%' }}
            role="progressbar"
            aria-valuenow={100}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progress: Step 4 of 4"
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4 text-text-primary text-center">
        Upload an Image (Optional)
      </h2>
      <p className="text-text-secondary text-center mb-8">
        If applicable, upload an image to help doctors assess your condition
      </p>

      {/* File Upload Area */}
      <div className="mb-8">
        {!formData.imageFile ? (
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 md:p-8 py-12 text-center
              transition-all duration-300 cursor-pointer min-h-[200px]
              ${isDragging 
                ? 'border-accent-primary bg-accent-primary bg-opacity-5' 
                : 'border-primary-border hover:border-accent-primary hover:bg-primary-card'
              }
            `}
            onClick={handleBrowseClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleBrowseClick();
              }
            }}
            aria-label="Upload image area. Click or drag and drop to select a file"
          >
            {/* Upload Icon */}
            <div className="flex justify-center mb-4">
              <svg 
                className="w-16 h-16 text-text-muted" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>

            {/* Upload Text */}
            <p className="text-lg font-medium text-text-primary mb-2">
              {isDragging ? 'Drop image here' : 'Drag and drop an image here'}
            </p>
            <p className="text-sm text-text-secondary mb-4">
              or
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseClick();
              }}
              className="mx-auto"
            >
              Browse Files
            </Button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
              aria-label="File input for image upload"
            />
          </div>
        ) : (
          /* Image Preview */
          <div className="bg-primary-card rounded-lg p-6 border border-primary-border">
            <div className="flex flex-col items-center">
              {/* Preview Image */}
              <div className="relative mb-4 max-w-md w-full">
                <img
                  src={formData.imagePreview}
                  alt="Preview of uploaded image"
                  className="w-full h-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '300px', objectFit: 'contain' }}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* File Info */}
              <div className="text-center mb-4">
                <p className="text-text-primary font-medium mb-1">
                  {formData.imageFile.name}
                </p>
                <p className="text-sm text-text-secondary">
                  {formatFileSize(formData.imageFile.size)}
                </p>
              </div>

              {/* Remove Button */}
              <Button
                variant="danger"
                size="sm"
                onClick={handleRemoveImage}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Image
              </Button>
            </div>
          </div>
        )}

        {/* Validation Error */}
        {validationError && (
          <div className="mt-4 p-4 bg-risk-critical bg-opacity-10 border border-risk-critical rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-risk-critical flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-risk-critical">
                  {validationError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Requirements Info */}
        <div className="mt-4 p-4 bg-primary-card rounded-lg border border-primary-border">
          <h3 className="text-sm font-medium text-text-primary mb-2">File Requirements:</h3>
          <ul className="text-sm text-text-secondary space-y-1">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Maximum file size: 5MB
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Allowed formats: JPEG, PNG, WebP
            </li>
          </ul>
        </div>
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
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleSkip}
            className="min-w-[120px]"
          >
            Skip
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            className="min-w-[120px]"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Help Text */}
      <p className="mt-6 text-sm text-text-muted text-center">
        This step is optional. You can skip it if you don't have an image to upload.
      </p>
    </div>
  );
};

export default TriageStep4;
