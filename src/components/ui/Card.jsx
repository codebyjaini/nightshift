const Card = ({ 
  children, 
  className = '', 
  onClick, 
  hoverable = false,
  gradient = false,
  ...props 
}) => {
  const baseStyles = 'bg-primary-card rounded-2xl shadow-card border border-primary-border transition-all duration-300 backdrop-blur-sm';
  
  const hoverStyles = hoverable 
    ? 'hover:scale-[1.02] hover:shadow-card-hover hover:border-accent-cyan/50 cursor-pointer' 
    : '';
  
  const gradientStyles = gradient
    ? 'bg-gradient-card'
    : '';
  
  const combinedClassName = `${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`;
  
  const handleClick = (e) => {
    if (onClick && hoverable) {
      onClick(e);
    }
  };
  
  const handleKeyDown = (e) => {
    if (onClick && hoverable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };
  
  return (
    <div
      className={combinedClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick && hoverable ? 'button' : undefined}
      tabIndex={onClick && hoverable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
