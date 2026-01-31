'use client';

import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignInForm } from '@/features/auth';
import { cn } from '@/lib/utils';

export function SignInForm() {
  const {
    data,
    errors,
    touched,
    error,
    isPending,
    showPassword,
    handleSubmit,
    updateField,
    handleBlur,
    togglePasswordVisibility,
  } = useSignInForm();

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {/* Email Field */}
      <div className='space-y-1'>
        <Input
          type='email'
          placeholder='Email'
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={cn(
            'h-12 md:h-14',
            touched.email && errors.email && 'border-red-500'
          )}
        />
        {touched.email && errors.email && (
          <p className='text-xs-custom font-medium text-red-500'>
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className='space-y-1'>
        <div className='relative'>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            value={data.password}
            onChange={(e) => updateField('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            className={cn(
              'h-12 pr-10 md:h-14',
              touched.password && errors.password && 'border-red-500'
            )}
          />
          <button
            type='button'
            onClick={togglePasswordVisibility}
            className='absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-neutral-500 hover:text-neutral-700'
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className='text-xs-custom font-medium text-red-500'>
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember Me */}
      <div className='flex items-center space-x-2'>
        <input
          type='checkbox'
          id='rememberMe'
          checked={data.rememberMe}
          onChange={(e) => updateField('rememberMe', e.target.checked)}
          className='text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-neutral-300'
        />
        <label
          htmlFor='rememberMe'
          className='text-sm-custom cursor-pointer text-neutral-600'
        >
          Remember Me
        </label>
      </div>

      {/* API Error Message */}
      {error && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-3'>
          <p className='text-sm-custom text-red-600'>
            Invalid email or password
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button type='submit' disabled={isPending} className='h-12 w-full text-white'>
        {isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
