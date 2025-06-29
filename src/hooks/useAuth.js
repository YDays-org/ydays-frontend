import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook to use the authentication context
 * @returns {Object} Authentication context values
 */
export const useAuth = () => {
  const {
    currentUser,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    syncUserProfile
  } = useContext(AuthContext);

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    syncUserProfile
  };
};

export default useAuth;
