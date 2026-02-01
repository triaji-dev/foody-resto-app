'use client';

import { useRouter } from 'next/navigation';
import {
  useRecommendedRestaurants,
  useBestSellers,
} from '@/features/restaurant';
import { useAuth } from '@/features/auth';
import type { Restaurant } from '@/types/api';
import RestaurantCard from '@/components/ui/restaurant-card';
import SkeletonCard from '@/components/views/home/components/skeleton-card';
import { ROUTES } from '@/constants';

function Recommended() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const {
    data: recommendedData,
    isLoading: isLoadingRecommended,
    error: errorRecommended,
    isError: isErrorRecommended,
  } = useRecommendedRestaurants({ enabled: isAuthenticated });

  const showBestSellers = !isAuthenticated || isErrorRecommended;

  const {
    data: bestSellersData,
    isLoading: isLoadingBestSellers,
    error: errorBestSellers,
  } = useBestSellers(1, 6, { enabled: showBestSellers });

  const isLoading = !showBestSellers
    ? isLoadingRecommended
    : isLoadingBestSellers;
  const error = !showBestSellers ? errorRecommended : errorBestSellers;

  const restaurants: Restaurant[] = !showBestSellers
    ? (recommendedData?.recommendations ?? [])
    : (bestSellersData?.restaurants ?? []);

  return (
    <div>
      <div className='mb-8 flex flex-row items-center justify-between px-4 sm:px-[clamp(1rem,8.33vw,7.5rem)]'>
        <h1 className='display-md font-extrabold'>Recommended</h1>
        <p
          className='text-primary text-lg-custom cursor-pointer font-extrabold hover:underline'
          onClick={() => router.push(ROUTES.RESTAURANTS)}
        >
          See All
        </p>
      </div>

      <div className='flex flex-col gap-6 px-4 pb-10 sm:px-[clamp(1rem,8.33vw,7.5rem)]'>
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
          <>
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                />
              ))}
            </div>
            {/* End of data message */}
            <div className='mt-4 text-center'>
              <p className='text-sm text-gray-500'>No more results to load</p>
            </div>
          </>
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
