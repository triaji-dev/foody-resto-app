import { Suspense } from 'react';
import HomePage from '@/components/views/home/home-page';

export default function Home() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-neutral-50' />}>
      <HomePage />
    </Suspense>
  );
}
