import { Suspense } from 'react';
import AuthPage from '@/components/views/auth/auth-page';

export default function AuthenticationPage() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-white lg:flex' />}>
      <AuthPage />
    </Suspense>
  );
}
