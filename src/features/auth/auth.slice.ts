import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import type { User } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Helper to get user from cookie
const getUserFromCookie = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userCookie = Cookies.get('user');
  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (e) {
      console.error('Failed to parse user cookie:', e);
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  user: getUserFromCookie(),
  token: typeof window !== 'undefined' ? Cookies.get('token') || null : null,
  isAuthenticated:
    typeof window !== 'undefined' ? !!Cookies.get('token') : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set credentials after login
     * Persists token and user to cookies (expires in 7 days)
     */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      if (typeof window !== 'undefined') {
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
      }
    },

    /**
     * Set user data (without changing token)
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      if (typeof window !== 'undefined') {
        Cookies.set('user', JSON.stringify(action.payload), { expires: 7 });
      }
    },

    /**
     * Set token only
     */
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;

      if (typeof window !== 'undefined') {
        Cookies.set('token', action.payload, { expires: 7 });
      }
    },

    /**
     * Logout - clear all auth state and cookies
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== 'undefined') {
        Cookies.remove('token');
        Cookies.remove('user');
      }
    },

    /**
     * Update user partially
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };

        if (typeof window !== 'undefined') {
          Cookies.set('user', JSON.stringify(state.user), { expires: 7 });
        }
      }
    },

    /**
     * Restore auth state from cookies (useful on app mount)
     */
    restoreAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = Cookies.get('token');
        const user = getUserFromCookie();

        if (token) {
          state.token = token;
          state.isAuthenticated = true;
          if (user) {
            state.user = user;
          }
        }
      }
    },
  },
});

export const {
  setCredentials,
  setUser,
  setToken,
  logout,
  updateUser,
  restoreAuth,
} = authSlice.actions;

export default authSlice.reducer;
