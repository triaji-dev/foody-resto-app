'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useProfile } from './auth.queries';
import { setUser, logout, restoreAuth } from './auth.slice';

/**
 * Custom hook for authentication state management
 * Combines Redux state with TanStack Query for profile fetching
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Fetch profile when authenticated but user data is missing
  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProfile(isAuthenticated && !user);

  // Restore auth state from cookies on mount
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  // Update user in Redux when profile is fetched
  useEffect(() => {
    if (profileData && !user) {
      dispatch(setUser(profileData));
    }
  }, [profileData, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const refreshProfile = async () => {
    const result = await refetch();
    if (result.data) {
      dispatch(setUser(result.data));
    }
    return result;
  };

  return {
    // State
    isAuthenticated,
    user,
    token,
    // Loading states
    isLoading,
    isError,
    error,
    // Actions
    logout: handleLogout,
    refreshProfile,
  };
};
