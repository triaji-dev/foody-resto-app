import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://restaurant-be-400174736012.asia-southeast2.run.app';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Bearer token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401/403 by clearing auth and redirecting
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        Cookies.remove('user');
        // Only redirect if not already on auth page
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
