'use client';

import { useState, useCallback } from 'react';
import { useRegister } from './auth.queries';
import { AxiosError } from 'axios';

interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

interface UseSignUpFormOptions {
  onSuccess?: () => void;
}

// Validation helpers
const validateName = (name: string): string | undefined => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  return undefined;
};

const validateEmail = (email: string): string | undefined => {
  if (!email) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Please enter a valid email';
  return undefined;
};

const validatePhone = (phone: string): string | undefined => {
  if (!phone) return 'Phone number is required';
  if (!/^[0-9+\-\s()]+$/.test(phone) || phone.length < 10)
    return 'Please enter a valid phone number (min 10 digits)';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
};

const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return undefined;
};

export function useSignUpForm(options?: UseSignUpFormOptions) {
  const registerMutation = useRegister();

  const [data, setData] = useState<SignUpData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time validation for a single field
  const validateField = useCallback(
    (
      field: keyof SignUpData,
      value: string,
      allData?: SignUpData
    ): string | undefined => {
      const currentData = allData || data;
      switch (field) {
        case 'name':
          return validateName(value);
        case 'email':
          return validateEmail(value);
        case 'phone':
          return validatePhone(value);
        case 'password':
          return validatePassword(value);
        case 'confirmPassword':
          return validateConfirmPassword(currentData.password, value);
        default:
          return undefined;
      }
    },
    [data]
  );

  // Validate all fields
  const validate = (): boolean => {
    const newErrors: FormErrors = {
      name: validateName(data.name),
      email: validateEmail(data.email),
      phone: validatePhone(data.phone),
      password: validatePassword(data.password),
      confirmPassword: validateConfirmPassword(
        data.password,
        data.confirmPassword
      ),
    };

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    return Object.values(newErrors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      // Reset form
      setData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
      });
      setTouched({});
      setErrors({});

      if (options?.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          setSubmitError('Email or Phone already registered');
        } else {
          setSubmitError(
            error.response?.data?.message ||
              'Registration failed. Please try again.'
          );
        }
      } else {
        setSubmitError('An unexpected error occurred.');
      }
    }
  };

  // Update field with real-time validation
  const updateField = useCallback(
    (field: keyof SignUpData, value: string) => {
      const newData = { ...data, [field]: value };
      setData(newData);

      // Real-time validation only if field was touched
      if (touched[field]) {
        const error = validateField(field, value, newData);
        setErrors((prev) => ({ ...prev, [field]: error }));

        // Also re-validate confirmPassword when password changes
        if (field === 'password' && touched.confirmPassword) {
          const confirmError = validateConfirmPassword(
            value,
            newData.confirmPassword
          );
          setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        }
      }
    },
    [data, touched, validateField]
  );

  // Mark field as touched and validate on blur
  const handleBlur = useCallback(
    (field: keyof SignUpData) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const value = data[field];
      // Type assertion needed because data[field] could be string (from interface) but compiler might verify stricter keys
      const error = validateField(field, value as string);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [data, validateField]
  );

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((prev) => !prev);

  return {
    data,
    errors,
    submitError,
    touched,
    showPassword,
    showConfirmPassword,
    isPending: registerMutation.isPending,
    error: registerMutation.error,
    handleSubmit,
    updateField,
    handleBlur,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  };
}
