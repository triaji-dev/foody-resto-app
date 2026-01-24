'use client';

import { useRouter } from 'next/navigation';
import { usePaginatedRestaurants } from '@/features/restaurant';
import RestaurantCard from '@/components/ui/restaurant-card';
import SkeletonCard from '@/views/home/components/skeleton-card';
import { useScreenSize } from '@/hooks/use-screen-size';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

function Recommended() {
  const router = useRouter();
  const { isMobile } = useScreenSize();
  const initialLimit = isMobile ? 6 : 12;

  const {
    restaurants,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    handleShowMore,
  } = usePaginatedRestaurants({ initialLimit });

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
            {Array.from({ length: initialLimit }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='py-4 text-center'>
            <p className='text-red-500'>Gagal memuat data</p>
          </div>
        )}

        {/* Restaurant Cards Grid */}
        {restaurants.length > 0 && (
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

        {/* Loading More Skeleton Cards */}
        {isLoadingMore && (
          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: initialLimit }).map((_, index) => (
              <SkeletonCard key={`loading-more-${index}`} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && restaurants.length === 0 && (
          <div className='py-8 text-center'>
            <p className='text-gray-500'>Tidak ada restoran ditemukan</p>
          </div>
        )}

        {/* Show More Button */}
        {hasMore && (
          <Button
            variant='outline'
            className='mx-auto mt-4 h-12 px-10 py-5'
            onClick={handleShowMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-gray-600'></div>
                Loading...
              </>
            ) : (
              'Show More'
            )}
          </Button>
        )}

        {/* No More Data Message */}
        {!hasMore && restaurants.length > 0 && (
          <div className='mt-4 text-center'>
            <p className='text-sm text-gray-500'>No more restaurants to load</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommended;
