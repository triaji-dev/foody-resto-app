import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api-client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from '@/services/types/auth.types';

// Query keys for caching
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>(
        '/api/auth/login',
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Store token in localStorage for axios interceptor
      localStorage.setItem('token', data.token);
      // Invalidate profile query to refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

// Register mutation
export function useRegister() {
  return useMutation({
    mutationFn: async (
      userData: RegisterRequest
    ): Promise<{ message: string }> => {
      const response = await apiClient.post('/api/auth/register', userData);
      return response.data;
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
}

// Get profile query
export function useProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get<User>('/api/auth/profile');
      return response.data;
    },
    enabled:
      enabled &&
      typeof window !== 'undefined' &&
      !!localStorage.getItem('token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest): Promise<User> => {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.email) formData.append('email', data.email);
      if (data.phone) formData.append('phone', data.phone);
      if (data.avatar) formData.append('avatar', data.avatar);

      const response = await apiClient.put<User>(
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
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.profile(), data);
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });
}
