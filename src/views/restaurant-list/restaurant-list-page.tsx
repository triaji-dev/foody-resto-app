'use client';

import { FilterSidebar } from './components/filter-sidebar';
import { RestaurantGrid } from './components/restaurant-grid';
import type { Restaurant } from '@/types/api';
import { GeolocationProvider } from '@/components/providers/geolocation-provider';

// Dummy data for the restaurant list
const DUMMY_RESTAURANTS: Restaurant[] = Array(8)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    name: 'Burger King',
    star: 4.9,
    place: 'Jakarta Selatan',
    logo: '/icons/bk-logo.png',
    images: ['/icons/bk-logo.png'],
    reviewCount: 120,
    menuCount: 45,
    priceRange: {
      min: 20000,
      max: 150000,
    },
    description: 'Fast food restaurant chain',
  }));

export default function RestaurantListPage() {
  return (
    <GeolocationProvider autoRequest={true}>
      <div className='min-h-screen bg-neutral-50 pt-20 pb-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <h1 className='mt-4 mb-8 text-3xl font-bold text-neutral-900'>
            All Restaurant
          </h1>

          <div className='flex flex-col gap-8 lg:flex-row'>
            {/* Sidebar Filter */}
            <div className='h-fit lg:sticky lg:top-24'>
              <FilterSidebar />
            </div>

            {/* Main Content */}
            <div className='flex-1'>
              <RestaurantGrid restaurants={DUMMY_RESTAURANTS} />
            </div>
          </div>
        </div>
      </div>
    </GeolocationProvider>
  );
}
