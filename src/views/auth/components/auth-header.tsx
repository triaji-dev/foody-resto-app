'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

interface AuthHeaderProps {
  activeTab?: 'signin' | 'signup';
}

const headerContent = {
  signin: {
    title: 'Welcome Back',
    subtitle: "Good to see you again! Let's eat",
  },
  signup: {
    title: 'Create Account',
    subtitle: 'Join us and discover great food nearby',
  },
};

export function AuthHeader({ activeTab = 'signin' }: AuthHeaderProps) {
  const router = useRouter();
  const content = headerContent[activeTab];

  return (
    <>
      {/* Back Button */}
      <Button
        variant='link'
        onClick={() => router.push(ROUTES.HOME)}
        className='flex items-center space-x-2 text-neutral-600 hover:text-neutral-800'
      >
        <ArrowLeft size={20} />
        <span className='text-sm font-medium'>Back</span>
      </Button>

      {/* Logo and Welcome Text */}
      <div className='space-y-5'>
        <div className='flex items-center space-x-2'>
          <Image
            src='/icons/logo-foody.svg'
            alt='Foody Logo'
            width={42}
            height={42}
            className='h-10.5 w-10.5'
          />
          <h1 className='display-md-extrabold text-foreground'>Foody</h1>
        </div>
        <div className='space-y-1'>
          <h2 className='display-sm-extrabold text-foreground'>
            {content.title}
          </h2>
          <p className='text-muted-foreground text-sm'>{content.subtitle}</p>
        </div>
      </div>
    </>
  );
}
