'use client';

import { useRouter } from 'next/navigation';
import {
  useRecommendedRestaurants,
  useBestSellers,
} from '@/features/restaurant';
import { useAuth } from '@/features/auth';
import type { Restaurant } from '@/types/api';
import RestaurantCard from '@/components/ui/restaurant-card';
import SkeletonCard from '@/views/home/components/skeleton-card';
import { ROUTES } from '@/constants';
import { error } from 'console';

function Recommended() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Fetch recommended if authenticated
  const {
    data: recommendedData,
    isLoading: isLoadingRecommended,
    error: errorRecommended,
    isError: isErrorRecommended,
  } = useRecommendedRestaurants({ enabled: isAuthenticated });

  // Fetch best sellers if NOT authenticated (fallback) OR if recommended failed (e.g. 403)
  const showBestSellers = !isAuthenticated || isErrorRecommended;

  const {
    data: bestSellersData,
    isLoading: isLoadingBestSellers,
    error: errorBestSellers,
  } = useBestSellers(1, 6, { enabled: showBestSellers });

  // Determine which data to show
  // If we are strictly trying to show recommended (Auth & !Error), use those states.
  // Otherwise use Best Seller states.
  const isLoading = !showBestSellers
    ? isLoadingRecommended
    : isLoadingBestSellers;
  const error = !showBestSellers ? errorRecommended : errorBestSellers;

  // Normalize data: best sellers returns nested structure
  const restaurants: Restaurant[] | undefined = !showBestSellers
    ? recommendedData
    : (bestSellersData as any)?.data?.restaurants;

  return (
    <div>
      <div className='mb-8 flex flex-row items-center justify-between px-4 md:px-30'>
        <h1 className='display-md-extrabold'>Recommended</h1>
        <p
          className='text-lg-extrabold text-primary cursor-pointer hover:underline'
          onClick={() => router.push(ROUTES.RESTAURANTS)}
        >
          See All
        </p>
      </div>

      <div className='flex flex-col gap-6 px-4 pb-10 md:px-30'>
        {/* Loading State */}
        {isLoading && (
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='py-4 text-center'>
            <p className='text-red-500'>
              {error instanceof Error ? error.message : 'Gagal memuat data'}
            </p>
          </div>
        )}

        {/* Restaurant Cards Grid */}
        {restaurants && restaurants.length > 0 && (
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onClick={() =>
                  console.log('View details for:', restaurant.name)
                }
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!restaurants || restaurants.length === 0) && (
          <div className='py-8 text-center'>
            <p className='text-gray-500'>No recommended restaurants</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommended;
