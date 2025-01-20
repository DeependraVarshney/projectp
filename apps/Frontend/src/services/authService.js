import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1/user',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to handle redirects based on user role
const handleRedirect = (user_role, userId) => {
  switch (user_role) {
    case 'student':
      // Store userId before redirect
      localStorage.setItem('userId', userId);
      window.location.href = '/student/complete-profile';
      break;
    case 'company':
      window.location.href = '/company/dashboard';
      break;
    case 'admin':
      window.location.href = '/admin/dashboard';
      break;
    default:
      window.location.href = '/admin/dashboard';
  }
};

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

const authService = {
  register: async (userData) => {
    try {
      console.log('Registration data:', userData);
      
      const response = await api.post('/register', {
        email: userData.email,
        password: userData.password,
        user_role: userData.user_role
      });

      console.log('Registration response:', response.data);

      // After successful registration, attempt login
      if (response.data.success || response.data.statusCode === 201) {
        const loginResponse = await authService.login({
          email: userData.email,
          password: userData.password,
          user_role: userData.user_role
        });
        
        // handleRedirect is called in login function
        return loginResponse;
      }

      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Login attempt with:', {
        email: credentials.email,
        user_role: credentials.user_role
      });

      const response = await api.post('/login', {
        email: credentials.email,
        password: credentials.password,
        user_role: credentials.user_role
      });

      console.log('Login response:', response.data);

      if (response.data.success || response.data.statusCode === 200) {
        const { data } = response.data;
        
        // Store tokens and user data
        if (data?.authToken) {
          localStorage.setItem('authToken', data.authToken);
        }
        if (data?.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        if (credentials.user_role) {
          localStorage.setItem('userRole', credentials.user_role);
        }
        if (data?.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        if (data?.user?._id) {
          localStorage.setItem('userId', data.user._id);
        }

        // Update handleRedirect call
        handleRedirect(credentials.user_role, data?.user?._id);
      }

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      localStorage.clear(); // Clear all stored data
      return response.data;
    } catch (error) {
      localStorage.clear(); // Clear data even if logout fails
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (resetToken, newPassword) => {
    const response = await api.post('/reset-password', {
      resetToken,
      newPassword
    });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post('/verify-email', { token });
    return response.data;
  }
};

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authService;