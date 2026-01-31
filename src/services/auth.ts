import { api } from '@/lib/axios';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  UpdateProfileRequest,
} from '@/types/api';

export const authService = {
  /**
   * Login user
   * @returns ApiResponse containing token and user data
   */
  login: async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/api/auth/login',
      data
    );
    return response.data;
  },

  /**
   * Register new user
   * @returns ApiResponse containing user data (201 Created on success)
   */
  register: async (data: RegisterRequest) => {
    const response = await api.post<ApiResponse<User>>(
      '/api/auth/register',
      data
    );
    return response.data;
  },

  /**
   * Get current user profile (requires auth)
   */
  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/api/auth/profile');
    return response.data;
  },

  /**
   * Update user profile (multipart/form-data for avatar upload)
   */
  updateProfile: async (data: UpdateProfileRequest) => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.avatar) formData.append('avatar', data.avatar);

    const response = await api.put<ApiResponse<User>>(
      '/api/auth/profile',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};

export default authService;
