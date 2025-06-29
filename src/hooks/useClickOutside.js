import { useEffect, useRef } from 'react';

/**
 * Hook that alerts when you click outside of the passed ref
 * @param {Function} handler Function to call when clicked outside
 * @returns {object} Ref to attach to the element
 */
function useClickOutside(handler) {
  const ref = useRef();
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }
    
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler]);
  
  return ref;
}

export default useClickOutside;
