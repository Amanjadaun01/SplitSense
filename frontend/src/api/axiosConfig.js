import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  timeout: 10000, // 10 second timeout
});

// Intercept every request before it leaves the frontend
API.interceptors.request.use(
  (config) => {
    // Get the current state from our Zustand store
    const state = useAuthStore.getState();
    const token = state.user?.token;
    
    // If we have a token, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  }, 
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Intercept responses to handle global errors
API.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(`[API Error] ${error.response.status}:`, error.response.data);
      
      // If token is invalid/expired, logout the user
      if (error.response.status === 401) {
        useAuthStore.setState({ user: null });
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('[API Network Error] No response received:', error.request);
    } else {
      // Error in request setup
      console.error('[API Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default API;