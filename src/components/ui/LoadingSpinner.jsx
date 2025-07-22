const LoadingSpinner = ({ size = 'md', className = '', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${colorClasses[color]}`}>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export const PageLoader = ({ message = "Chargement..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="xl" className="mb-4" />
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  </div>
);

export const CardLoader = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
    <div className="space-y-2">
      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
    </div>
  </div>
);

export const ListLoader = ({ items = 3, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {[...Array(items)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 h-12 w-12 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSpinner; 