import { createContext } from 'react';

/**
 * Authentication Context
 * Used by AuthProvider to provide authentication state and functions
 */
export const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  isLoading: true,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  syncUserProfile: () => {},
  isAuthenticated: () => false,
});
