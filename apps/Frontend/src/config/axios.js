import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { API_BASE_URL } from './constants';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  // async (error) => {
  //   const originalRequest = error.config;

  //   // Handle 401 Unauthorized errors
  //   if (error.response?.status === 401 && !originalRequest._retry) {
  //     originalRequest._retry = true;

  //     try {
  //       // Try to refresh token
  //       const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
  //         refreshToken: localStorage.getItem('refreshToken'),
  //       });

  //       const { token } = response.data;
  //       localStorage.setItem('token', token);

  //       // Retry the original request
  //       originalRequest.headers.Authorization = `Bearer ${token}`;
  //       return axiosInstance(originalRequest);
  //     } catch (refreshError) {
  //       // If refresh token fails, logout user
  //       store.dispatch(logout());
  //       return Promise.reject(refreshError);
  //     }
  //   }
    (error) => {
      if (error.message === 'Network Error') {
        console.error('Backend server is not running or not accessible');
      }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default axiosInstance; 