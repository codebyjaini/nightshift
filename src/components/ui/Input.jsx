const Input = ({ 
  type = 'text', 
  label, 
  value, 
  onChange, 
  error, 
  placeholder, 
  required = false, 
  disabled = false,
  className = '',
  id,
  name,
  icon,
  ...props 
}) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${inputId}-error`;
  
  const baseInputStyles = 'w-full px-4 py-3.5 min-h-[48px] bg-primary-navy/50 border-2 rounded-xl text-text-primary placeholder-text-dim transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm';
  
  const errorStyles = error 
    ? 'border-risk-critical focus:ring-risk-critical/50 focus:border-risk-critical' 
    : 'border-primary-border hover:border-accent-cyan/30';
  
  const iconStyles = icon ? 'pl-12' : '';
  
  const inputClassName = `${baseInputStyles} ${errorStyles} ${iconStyles}`;
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(type === 'number' ? e.target.valueAsNumber : e.target.value);
    }
  };
  
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="text-sm font-semibold text-text-secondary"
        >
          {label}
          {required && <span className="text-risk-critical ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
            {icon}
          </div>
        )}
        
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`${inputClassName} min-h-[140px] resize-y`}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
        ) : (
          <input
            type={type}
            id={inputId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClassName}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
        )}
      </div>
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-risk-critical flex items-center gap-1"
          role="alert"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
