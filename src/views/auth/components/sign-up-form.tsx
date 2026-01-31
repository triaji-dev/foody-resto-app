'use client';

import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignUpForm } from '@/features/auth';
import { cn } from '@/lib/utils';

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const {
    data,
    errors,
    submitError,
    touched,
    error,
    isPending,
    showPassword,
    showConfirmPassword,
    handleSubmit,
    updateField,
    handleBlur,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useSignUpForm({ onSuccess });

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      {/* Name Field */}
      <div className='space-y-1'>
        <Input
          type='text'
          placeholder='Name'
          value={data.name}
          onChange={(e) => updateField('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className={cn(
            'h-12 md:h-14',
            touched.name && errors.name && 'border-red-500'
          )}
        />
        {touched.name && errors.name && (
          <p className='text-xs-custom font-medium text-red-500'>
            {errors.name}
          </p>
        )}
      </div>

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

      {/* Phone Field */}
      <div className='space-y-1'>
        <Input
          type='tel'
          placeholder='Phone Number'
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          className={cn(
            'h-12 md:h-14',
            touched.phone && errors.phone && 'border-red-500'
          )}
        />
        {touched.phone && errors.phone && (
          <p className='text-xs-custom font-medium text-red-500'>
            {errors.phone}
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

      {/* Confirm Password Field */}
      <div className='space-y-1'>
        <div className='relative'>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder='Confirm Password'
            value={data.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
            className={cn(
              'h-12 pr-10 md:h-14',
              touched.confirmPassword &&
                errors.confirmPassword &&
                'border-red-500'
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
        {touched.confirmPassword && errors.confirmPassword && (
          <p className='text-xs-custom font-medium text-red-500'>
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* API Error Message */}
      {submitError && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-3'>
          <p className='text-sm-custom text-red-600'>{submitError}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button type='submit' disabled={isPending} className='h-12 w-full'>
        {isPending ? 'Creating account...' : 'Register'}
      </Button>
    </form>
  );
}
