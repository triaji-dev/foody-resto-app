'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegister, useLogin, useProfile } from './auth.queries';
import { setCredentials } from './auth.slice';
import { useAppDispatch } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

interface FormData {
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

export default function RegisterForm({
  onSuccess,
  redirectTo = '/',
}: RegisterFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const registerMutation = useRegister();
  const loginMutation = useLogin();
  const { refetch: refetchProfile } = useProfile(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Register the user
      await registerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      toast.success('Registration successful! Logging you in...');

      // Auto-login after successful registration
      const loginResult = await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      // Fetch user profile after login
      const profileResult = await refetchProfile();

      if (profileResult.data) {
        dispatch(
          setCredentials({
            token: loginResult.token,
            user: profileResult.data,
          })
        );
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isLoading = registerMutation.isPending || loginMutation.isPending;

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-center text-2xl font-bold'>
          Create Account
        </CardTitle>
        <p className='text-muted-foreground text-center text-sm'>
          Sign up to start ordering delicious food
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='name' className='text-sm font-medium'>
              Full Name
            </label>
            <Input
              id='name'
              name='name'
              type='text'
              placeholder='John Doe'
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className='text-xs text-red-500'>{errors.name}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='email' className='text-sm font-medium'>
              Email
            </label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='john@example.com'
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className='text-xs text-red-500'>{errors.email}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='phone' className='text-sm font-medium'>
              Phone Number
            </label>
            <Input
              id='phone'
              name='phone'
              type='tel'
              placeholder='081234567890'
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className='text-xs text-red-500'>{errors.phone}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='password' className='text-sm font-medium'>
              Password
            </label>
            <Input
              id='password'
              name='password'
              type='password'
              placeholder='••••••••'
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className='text-xs text-red-500'>{errors.password}</p>
            )}
          </div>

          <div className='space-y-2'>
            <label htmlFor='confirmPassword' className='text-sm font-medium'>
              Confirm Password
            </label>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='••••••••'
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && (
              <p className='text-xs text-red-500'>{errors.confirmPassword}</p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className='mt-4 text-center text-sm'>
          <span className='text-muted-foreground'>
            Already have an account?{' '}
          </span>
          <Link href='/login' className='text-primary hover:underline'>
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
