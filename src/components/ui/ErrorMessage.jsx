import Button from './Button';

const ErrorMessage = ({ 
  message = 'An error occurred. Please try again.',
  onRetry,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center gap-4 p-6 bg-primary-card border border-risk-critical rounded-lg ${className}`}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <div className="flex items-center gap-3">
        <svg
          className="h-6 w-6 text-risk-critical flex-shrink-0"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-text-primary text-center">{message}</p>
      </div>
      
      {onRetry && (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
