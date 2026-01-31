'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { authService } from '@/services/auth';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from '@/types/api';

// ============================================
// QUERY KEYS - Centralized cache key management
// ============================================
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// ============================================
// MUTATIONS
// ============================================

/**
 * Login mutation
 * On success: stores token in cookies and invalidates profile query
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authService.login(credentials);
      return response.data; // LoginResponse { token, user }
    },
    onSuccess: (data) => {
      // Store token and user in cookies
      Cookies.set('token', data.token, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
      // Invalidate profile query to refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

/**
 * Register mutation
 * Returns user data on success (201 Created)
 */
export function useRegister() {
  return useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      const response = await authService.register(userData);
      return response; // ApiResponse { success, message, data: User }
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
}

// ============================================
// QUERIES
// ============================================

/**
 * Get profile query
 * Auto-enables when token exists in cookies
 * Returns full TanStack Query state: { data, isLoading, isError, error, isFetching, isSuccess, refetch }
 */
export function useProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authService.getProfile();
      return response.data; // User
    },
    enabled: enabled && typeof window !== 'undefined' && !!Cookies.get('token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    retry: false, // Don't retry on auth failures
  });
}

/**
 * Update profile mutation
 * On success: updates cached profile data
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await authService.updateProfile(data);
      return response.data; // User
    },
    onSuccess: (data) => {
      // Update cached profile data
      queryClient.setQueryData(authKeys.profile(), data);
      // Also update cookie
      Cookies.set('user', JSON.stringify(data), { expires: 7 });
    },
    onError: (error) => {
      console.error('Profile update failed:', error);
    },
  });
}
