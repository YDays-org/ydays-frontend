import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Custom hook to use the authentication context
 * @returns {Object} Authentication context values
 */
export const useAuth = () => {
  const {
    currentUser,
    userProfile,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    syncUserProfile,
    resetPassword
  } = useContext(AuthContext);

  return {
    currentUser,
    userProfile,
    isAuthenticated,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    syncUserProfile,
    resetPassword
  };
};

export default useAuth;
