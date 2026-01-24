import axios from 'axios';
import { API_BASE_URL } from '@/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Bearer token to requests
apiClient.interceptors.request.use(
  (config) => {
    // In a real app, we might get this from Redux store or localStorage
    // For now, let's assume it's stored in localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle errors (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., 401 Unauthorized)
    // Handle global errors here (e.g., 401 Unauthorized)
    if (error.response?.status === 401) {
      // Clear token and redirect to login if needed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth'; // Redirect to auth page
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
