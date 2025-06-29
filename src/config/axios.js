import axios from 'axios';

/**
 * Axios instance with default configuration for API requests
 */
const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - can be used to add auth tokens to requests
api.interceptors.request.use(
  async (config) => {
    // Get token from localStorage directly
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // If no stored token, try to get a fresh one from Firebase
      try {
        const { auth } = await import('./firebase');
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken(true); // Force token refresh
          if (token) {
            // Store the fresh token
            localStorage.setItem('authToken', token);
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.warn('Could not get authentication token', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - can be used to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error status codes if needed
    const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
