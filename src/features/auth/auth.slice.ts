import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/services/types/auth.types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      // Persist token to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      // Remove token from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    initializeAuth: (state) => {
      // Check localStorage for existing token
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
          state.token = token;
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { setCredentials, setUser, logout, updateUser, initializeAuth } =
  authSlice.actions;

export default authSlice.reducer;
