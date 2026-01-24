'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from './auth.queries';
import { ROUTES } from '@/constants';

interface SignInData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface UseSignInFormOptions {
  onSuccess?: () => void;
}

// Validation helpers
const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Please enter a valid email';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
};

export function useSignInForm(options?: UseSignInFormOptions) {
  const router = useRouter();
  const loginMutation = useLogin();

  const [data, setData] = useState<SignInData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);

  // Real-time validation for a single field
  const validateField = useCallback(
    (field: keyof SignInData, value: string): string | undefined => {
      switch (field) {
        case 'email':
          return validateEmail(value);
        case 'password':
          return validatePassword(value);
        default:
          return undefined;
      }
    },
    []
  );

  // Validate all fields
  const validate = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(data.email),
      password: validatePassword(data.password),
    };

    setErrors(newErrors);
    setTouched({ email: true, password: true });

    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      if (options?.onSuccess) {
        options.onSuccess();
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Update field with real-time validation
  const updateField = useCallback(
    (field: keyof SignInData, value: string | boolean) => {
      setData((prev) => ({ ...prev, [field]: value }));

      // Real-time validation only if field was touched
      if (touched[field] && typeof value === 'string') {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [touched, validateField]
  );

  // Mark field as touched and validate on blur
  const handleBlur = useCallback(
    (field: keyof SignInData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const value = data[field];
      if (typeof value === 'string') {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [data, validateField]
  );

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return {
    data,
    errors,
    touched,
    showPassword,
    isPending: loginMutation.isPending,
    error: loginMutation.error,
    handleSubmit,
    updateField,
    handleBlur,
    togglePasswordVisibility,
  };
}
