const Badge = ({ 
  variant = 'low', 
  children, 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md';
  
  const variantStyles = {
    critical: 'bg-risk-critical text-white',
    medium: 'bg-risk-medium text-white',
    low: 'bg-risk-low text-white',
    treated: 'bg-status-treated text-white',
    untreated: 'bg-status-untreated text-white',
    success: 'bg-green-500/10 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30',
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <span
      className={combinedClassName}
      role="status"
      aria-label={`${variant} status`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
