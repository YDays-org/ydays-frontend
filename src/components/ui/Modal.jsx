import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);

  // Focus trap
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        ref={dialogRef}
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative focus:outline-none"
        tabIndex={0}
        role="document"
        aria-labelledby="modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Fermer le modal"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {title && (
          <h3 id="modal-title" className="text-xl font-bold mb-4 text-gray-900">
            {title}
          </h3>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal; 