import { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { storageService } from '../services/storageService';
import { profileService } from '../services/profileService';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync user profile from server when user changes
  const syncUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      storageService.removeUserProfile();
      return;
    }

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
  const storeToken = (user) => {
    const token = user?.accessToken || user?.stsTokenManager?.accessToken;
    if (token) {
      localStorage.setItem('authToken', token);
    }
  };

  // Store user info and token in localStorage
  const storeUserInfo = (user) => {
    const token = user?.accessToken || user?.stsTokenManager?.accessToken;
    const userInfo = {
      uid: user?.uid,
      email: user?.email,
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      token,
    };
    localStorage.setItem('authUser', JSON.stringify(userInfo));
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
          console.log('Validating token and restoring session...');
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

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
     
        storeToken(user);
        storeUserInfo(user);
        setCurrentUser(user);
        await syncUserProfile(user);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        storageService.clearAll();
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      storeToken(user);
      storeUserInfo(user);
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Create user profile on server if additional data provided
      if (Object.keys(userData).length > 0) {
        try {
          await profileService.updateUserProfile(userData);
        } catch (profileError) {
          console.error('Error creating user profile:', profileError);
          // Don't fail the signup if profile creation fails
        }
      }
      
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('authUser');
      storageService.clearAll();
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      storeToken(user);
      storeUserInfo(user);
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  // Check if the user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    console.log("token from authProvider",token)
    const currentUser = JSON.parse(localStorage.getItem('authUser'));
    console.log("currentUser from authProvider",currentUser)
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
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
