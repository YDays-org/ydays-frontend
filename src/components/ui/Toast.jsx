import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = ({ 
  message, 
  type = 'info', 
  isVisible = false, 
  onClose, 
  duration = 5000,
  title
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getClasses = () => {
    const baseClasses = "fixed top-4 right-4 z-50 max-w-md w-full bg-white shadow-lg rounded-lg border-l-4 p-4 transition-all duration-300 transform";
    
    if (!show) return `${baseClasses} translate-x-full opacity-0`;
    
    const typeClasses = {
      success: "border-green-500",
      error: "border-red-500", 
      warning: "border-yellow-500",
      info: "border-blue-500"
    };
    
    return `${baseClasses} translate-x-0 opacity-100 ${typeClasses[type]}`;
  };

  return (
    <div className={getClasses()}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm text-gray-700">
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => {
              setShow(false);
              onClose?.();
            }}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
