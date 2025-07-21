import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
  
});

export default api;
