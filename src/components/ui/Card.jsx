const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = true,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200';
  const shadowClasses = hover ? 'shadow-md hover:shadow-xl' : 'shadow-lg';
  const hoverClasses = hover ? 'hover:scale-105 cursor-pointer' : '';
  const paddingClasses = padding ? 'p-6' : '';
  
  const classes = `${baseClasses} ${shadowClasses} ${hoverClasses} ${paddingClasses} ${className}`;
  
  return (
    <div 
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 