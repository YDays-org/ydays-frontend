import { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const base = 'fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg flex items-center min-w-[220px] max-w-xs';
  const types = {
    success: 'bg-green-50 text-green-800 border border-green-200',
    error: 'bg-red-50 text-red-800 border border-red-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200',
  };

  return (
    <div className={`${base} ${types[type] || types.info}`}> 
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-3 text-lg font-bold">×</button>
    </div>
  );
};

export default Toast; 