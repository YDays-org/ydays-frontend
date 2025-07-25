import { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  signInWithPopup, 
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { storageService } from '../services/storageService';
import { profileService } from '../services/profileService';
import { AuthContext } from './AuthContext';
import api from '../services/api'; // Import the API service

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync user profile from server when user changes
  const syncUserProfile = async () => {
    // if (!user) {
    //   setUserProfile(null);
    //   storageService.removeUserProfile();
    //   return;
    // }

    try {
      // Try to get cached profile first
      const cachedProfile = storageService.getUserProfile();
      if (cachedProfile) {
        setUserProfile(cachedProfile);
      }

      // Fetch fresh profile from server
      const serverProfile = await profileService.getUserProfile();
      if (serverProfile) {
        setUserProfile(serverProfile);
        storageService.setUserProfile(serverProfile);
      }
    } catch (error) {
      console.error('Error syncing user profile:', error);
      // If we have cached profile, use it as fallback
      const cachedProfile = storageService.getUserProfile();
      if (cachedProfile) {
        setUserProfile(cachedProfile);
      }
    }
  };

  // Store token in localStorage when user logs in
  const storeToken = async (user) => {
    try {
      const token = await user.getIdToken();
      if (token) {
        localStorage.setItem('authToken', token);
      }
    } catch (error) {
      console.error('Error getting ID token:', error);
    }
  };

  // Store user info and token in localStorage
  const storeUserInfo = async (user) => {
    try {
      const token = await user.getIdToken();
      const userInfo = {
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
        photoURL: user?.photoURL,
        token,
      };
      localStorage.setItem('authUser', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error storing user info:', error);
    }
  };

  // Restore token and user info from localStorage on app initialization
  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');

      if (token && storedUser) {
        try {
          // Optionally validate token with backend or Firebase
          // console.log('Validating token and restoring session...');
          const parsedUser = JSON.parse(storedUser);

          // Simulate token validation (replace with actual validation logic)
          const isValidToken = true; // Replace with backend/Firebase validation

          if (isValidToken) {
            setCurrentUser(parsedUser);
          } else {
            console.warn('Invalid token, clearing session.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
          }
        } catch (error) {
          console.error('Error restoring session:', error);
        }
      }

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  // Sync user with database
  const syncUserWithDatabase = async (user) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const userInfo = {
        id: user.uid,
        email: user.email,
        fullName: user.displayName || '',
        profilePictureUrl: user.photoURL || '',
        emailVerified: user.emailVerified || false,
        phoneNumber: user.phoneNumber || '',
      };

      await api.post('/api/auth/sync-user', userInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log('User successfully synced with database.');
    } catch (error) {
      console.error('Error syncing user with database:', error);
    }
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await storeToken(user);
        await storeUserInfo(user);
        setCurrentUser({ ...user });
        await syncUserProfile(user);
        await syncUserWithDatabase(user); // Sync user with database
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        storageService.clearAuthData();
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Store currentUser in localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('authUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('authUser');
    }
  }, [currentUser]);

  // Authentication functions
  const signIn = async (email, password) => {
    try {
      console.log(`Attempting to sign in with email: ${email}`);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await storeToken(user);
      await storeUserInfo(user);

      // Sync user with database
      await syncUserWithDatabase(user);

      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Provide more specific error messages based on Firebase error codes
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Email ou mot de passe incorrect.');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('Aucun compte trouvé avec cette adresse email.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Mot de passe incorrect.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
      } else if (error.code === 'auth/user-disabled') {
        throw new Error('Ce compte a été désactivé.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Format d\'email invalide.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Problème de connexion réseau. Vérifiez votre connexion internet.');
      } else {
        throw new Error(`Une erreur est survenue lors de la connexion. (${error.code})`);
      }
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      // Call the server API to create a new user
      const response = await api.post('/api/auth/sign-up', {
        email,
        password,
        ...userData,
      });

      if (response.data.success) {
        // console.log('User successfully signed up via server API.');
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Failed to sign up.');
      }
    } catch (error) {
      console.error('Sign up error via server API:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut(auth);

      // Clear local state
      setCurrentUser(null);
      // console.log('Setting currentUser to null after signOut');
      setUserProfile(null);

      // Remove user data from localStorage
      localStorage.removeItem('authUser');
      localStorage.removeItem('authToken');

      // Clear any cached data in storageService
      storageService.clearAuthData();

      // Redirect to home page
      window.location.href = '/';

      // console.log('User successfully signed out.');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Reset password for a user
  const resetPassword = async (email) => {
    try {
      // Make API call to request password reset
      const response = await api.post('/api/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await storeToken(user);
      await storeUserInfo(user);

      // Sync user with database
      await syncUserWithDatabase(user);

      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  // Facebook sign-in functionality has been removed

  // Check if the user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    // console.log("token from authProvider",token)
    const currentUser = JSON.parse(localStorage.getItem('authUser'));
    // console.log("currentUser from authProvider",currentUser)
    return !!currentUser && !!token;
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    signIn,
    signUp,
    signOut,
    syncUserProfile,
    isAuthenticated,
    signInWithGoogle,
    resetPassword // Expose resetPassword function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
