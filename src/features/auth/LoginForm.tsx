'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin, useProfile } from './auth.queries';
import { setCredentials } from './auth.slice';
import { useAppDispatch } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function LoginForm({
  onSuccess,
  redirectTo = '/',
}: LoginFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loginMutation = useLogin();
  const { refetch: refetchProfile } = useProfile(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await loginMutation.mutateAsync(formData);

      // Fetch user profile after successful login
      const profileResult = await refetchProfile();

      if (profileResult.data) {
        dispatch(
          setCredentials({
            token: result.token,
            user: profileResult.data,
          })
        );
      }

      toast.success('Login successful! Welcome back.');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid email or password';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-center text-2xl font-bold'>
          Welcome Back
        </CardTitle>
        <p className='text-muted-foreground text-center text-sm'>
          Sign in to your account to continue
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
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
              disabled={loginMutation.isPending}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className='text-xs text-red-500'>{errors.email}</p>
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
              disabled={loginMutation.isPending}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className='text-xs text-red-500'>{errors.password}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className='mt-4 text-center text-sm'>
          <span className='text-muted-foreground'>
            Don&apos;t have an account?{' '}
          </span>
          <Link href='/register' className='text-primary hover:underline'>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
