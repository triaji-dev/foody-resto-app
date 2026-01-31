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
      {/* Logo and Welcome Text */}
      <div className='space-y-5'>
        <Button
          variant='logo'
          size='none'
          onClick={() => router.push(ROUTES.HOME)}
        >
          <Image
            src='/icons/logo-foody.svg'
            alt='Foody Logo'
            width={42}
            height={42}
            className='h-10.5 w-10.5'
          />
          <h1 className='display-md text-foreground font-extrabold'>Foody</h1>
        </Button>
        <div className='space-y-1'>
          <h2 className='display-sm text-foreground font-extrabold'>
            {content.title}
          </h2>
          <p className='text-muted-foreground text-sm-custom'>
            {content.subtitle}
          </p>
        </div>
      </div>
    </>
  );
}
