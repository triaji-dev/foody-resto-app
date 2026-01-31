'use client';

import { FilterSidebar } from './components/filter-sidebar';
import { RestaurantGrid } from './components/restaurant-grid';
import type { Restaurant } from '@/types/api';
import { GeolocationProvider } from '@/components/providers/geolocation-provider';

import { ListFilter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
      <div className='min-h-screen bg-neutral-50 pt-16 pb-16 md:pt-20'>
        <div className='mx-auto px-4 sm:px-[clamp(1rem,8.33vw,7.5rem)]'>
          <h1 className='text-display-xs md:text-display-md mt-4 mb-4 font-extrabold text-neutral-900 md:mt-12 md:mb-8'>
            All Restaurants
          </h1>

          <div className='flex flex-col gap-4 md:gap-10 lg:flex-row'>
            {/* Mobile Filter Button */}
            <div className='block lg:hidden'>
              <Sheet>
                <SheetTrigger asChild>
                  <button className='flex w-full cursor-pointer items-center justify-between rounded-xl bg-white p-4 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] transition-all active:scale-95'>
                    <span className='text-md font-extrabold text-neutral-900'>
                      FILTER
                    </span>
                    <ListFilter className='h-5 w-5 text-neutral-900' />
                  </button>
                </SheetTrigger>
                <SheetContent side='left' className='w-[320px] p-0'>
                  <div className='h-full overflow-y-auto px-6 py-10'>
                    <FilterSidebar isSheet />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Sidebar Filter */}
            <div className='hidden h-fit lg:sticky lg:top-24 lg:block'>
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
