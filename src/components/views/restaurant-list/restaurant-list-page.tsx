'use client';

import { FilterSidebar } from './components/filter-sidebar';
import { RestaurantGrid } from './components/restaurant-grid';
import {
  GeolocationProvider,
  useGeolocationContext,
} from '@/components/providers/geolocation-provider';
import { Suspense } from 'react';

import { ListFilter } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import {
  useRestaurants,
  useRestaurantFiltersFromURL,
} from '@/features/restaurant/restaurant.queries';

import { calculateDistance, getMockCoordinates } from '@/lib/distance';

function RestaurantListContent() {
  const filters = useRestaurantFiltersFromURL();
  const { latitude, longitude } = useGeolocationContext();

  // Merge location into filters
  const activeFilters = {
    ...filters,
    lat: latitude || undefined,
    long: longitude || undefined,
  };

  const { data, isLoading, isError } = useRestaurants(activeFilters);

  // Data is now RestaurantListData { restaurants, pagination }
  const rawRestaurants = data?.restaurants ?? [];

  // Client-side filtering for range (backup if backend fails)
  const restaurants = rawRestaurants.filter((restaurant) => {
    if (!filters.range || !latitude || !longitude) return true;

    const restaurantCoords = getMockCoordinates(restaurant.place);
    const distance = calculateDistance(
      latitude,
      longitude,
      restaurantCoords.lat,
      restaurantCoords.lng
    );
    return distance <= filters.range;
  });

  return (
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
                  <span className='text-md-custom font-extrabold text-neutral-900'>
                    FILTER
                  </span>
                  <ListFilter className='h-5 w-5 text-neutral-900' />
                </button>
              </SheetTrigger>
              <SheetContent side='left' className='w-[320px] p-0'>
                <div className='h-full overflow-y-auto px-6 py-10'>
                  <Suspense
                    fallback={<div className='p-6'>Loading filters...</div>}
                  >
                    <FilterSidebar isSheet />
                  </Suspense>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar Filter */}
          <div className='hidden h-fit lg:sticky lg:top-24 lg:block'>
            <Suspense
              fallback={
                <div className='h-64 w-72 animate-pulse rounded-2xl bg-white p-4' />
              }
            >
              <FilterSidebar />
            </Suspense>
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            {isLoading ? (
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5'>
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className='h-40 animate-pulse rounded-2xl bg-neutral-200'
                    />
                  ))}
              </div>
            ) : isError ? (
              <div className='py-12 text-center'>
                <p className='text-neutral-500'>Failed to load restaurants.</p>
              </div>
            ) : restaurants.length === 0 ? (
              <div className='py-12 text-center'>
                <p className='text-neutral-500'>No restaurants found.</p>
              </div>
            ) : (
              <RestaurantGrid restaurants={restaurants} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RestaurantListPage() {
  return (
    <GeolocationProvider autoRequest={true}>
      <RestaurantListContent />
    </GeolocationProvider>
  );
}
