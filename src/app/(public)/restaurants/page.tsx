import RestaurantListPage from '@/components/views/restaurant-list/restaurant-list-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Restaurants | Foody',
  description: 'Browse all restaurants on Foody',
};

import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-neutral-50' />}>
      <RestaurantListPage />
    </Suspense>
  );
}
