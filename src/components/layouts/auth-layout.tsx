import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='flex flex-col items-center justify-center text-center'>
          <Link href={ROUTES.HOME} className='flex items-center gap-2'>
            <Image
              src='/icons/logo-foody.svg'
              alt='Foody Logo'
              width={48}
              height={48}
              className='h-12 w-12'
            />
          </Link>
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>
            {title}
          </h2>
          {subtitle && (
            <p className='text-sm-custom mt-2 text-gray-600'>{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
