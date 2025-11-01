import api from "../helper/api";
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  ChangePasswordRequest, 
  AuthResponse 
} from "../models/User";

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authServices = {
  // Login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('api/login', credentials);
    
    // Store token and user in localStorage
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('api/register', data);
    
    // Store token and user in localStorage
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Get current authenticated user
  me: async (): Promise<User> => {
    const response = await api.get<User>('api/me');
    
    // Update user in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await api.post('/logout');
    } finally {
      // Clear token and user from localStorage regardless of API response
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  // Refresh token
  refresh: async (): Promise<string> => {
    const response = await api.post<{ token: string }>('api/refresh');
    
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }
    
    return response.data.token;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('api/change-password', data);
    return response.data;
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get stored user
  getUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Clear auth data
  clearAuth: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
