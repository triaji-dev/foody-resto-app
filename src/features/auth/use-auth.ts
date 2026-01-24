'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useProfile } from './auth.queries';
import { setUser, logout, initializeAuth } from './auth.slice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { token, user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Fetch profile when authenticated but user data is missing
  const {
    data: profileData,
    isLoading,
    refetch,
  } = useProfile(isAuthenticated && !user);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    dispatch(initializeAuth());
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
    isAuthenticated,
    user,
    token,
    isLoading,
    logout: handleLogout,
    refreshProfile,
  };
};
