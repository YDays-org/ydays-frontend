import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      // Optionally redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
