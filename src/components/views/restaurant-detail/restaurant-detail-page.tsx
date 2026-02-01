'use client';

import { useQuery } from '@tanstack/react-query';
import { restaurantService } from '@/services/restaurant';
import RestaurantHero from './components/restaurant-hero';
import RestaurantInfo from './components/restaurant-info';
import MenuSection from './components/menu-section';
import ReviewSection from './components/review-section';
import { useCart } from '@/features/cart/useCart';

interface RestaurantDetailPageProps {
  restaurantId: number;
}

export default function RestaurantDetailPage({
  restaurantId,
}: RestaurantDetailPageProps) {
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: () => restaurantService.getRestaurantDetail(restaurantId),
    staleTime: 5 * 60 * 1000,
  });

  const restaurant = response?.data;

  const { addToCart, isAdding } = useCart(false);

  const handleAddToCart = (menuId: number, quantity: number) => {
    addToCart({ menuId, quantity, restaurantId });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen px-4 pt-16 sm:px-[clamp(1rem,8.33vw,7.5rem)] md:pt-20'>
        {/* Hero Skeleton */}
        <div className='px-4 py-6 sm:px-6 lg:px-8'>
          <div className='grid h-[300px] animate-pulse grid-cols-2 gap-4 sm:h-[400px] md:h-[500px]'>
            <div className='rounded-2xl bg-neutral-200' />
            <div className='grid grid-rows-2 gap-4'>
              <div className='rounded-2xl bg-neutral-200' />
              <div className='grid grid-cols-2 gap-4'>
                <div className='rounded-2xl bg-neutral-200' />
                <div className='rounded-2xl bg-neutral-200' />
              </div>
            </div>
          </div>
        </div>

        {/* Info Skeleton */}
        <div className='px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex items-center gap-4'>
            <div className='h-20 w-20 animate-pulse rounded-xl bg-neutral-200' />
            <div className='flex flex-col gap-2'>
              <div className='h-8 w-48 animate-pulse rounded bg-neutral-200' />
              <div className='h-4 w-24 animate-pulse rounded bg-neutral-200' />
              <div className='h-4 w-32 animate-pulse rounded bg-neutral-200' />
            </div>
          </div>
        </div>

        {/* Menu Skeleton */}
        <div className='bg-neutral-900 px-4 py-8 sm:px-6 lg:px-8'>
          <div className='mb-6 h-10 w-32 animate-pulse rounded bg-neutral-700' />
          <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className='aspect-square animate-pulse rounded-2xl bg-neutral-700'
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className='flex min-h-screen items-center justify-center px-4 pt-16 sm:px-[clamp(1rem,8.33vw,7.5rem)] md:pt-20'>
        <div className='text-center'>
          <h1 className='display-md font-extrabold text-neutral-900'>
            Restaurant Not Found
          </h1>
          <p className='text-md-custom mt-2 text-neutral-600'>
            The restaurant you&apos;re looking for doesn&apos;t exist or has
            been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen px-4 pt-16 sm:px-[clamp(1rem,8.33vw,7.5rem)] md:pt-20'>
      {/* Hero Image Gallery */}
      <div className='px-4 py-6 sm:px-6 lg:px-8'>
        <RestaurantHero images={restaurant.images} name={restaurant.name} />
      </div>

      {/* Restaurant Info */}
      <div className='px-4 sm:px-6 lg:px-8'>
        <RestaurantInfo
          logo={restaurant.logo}
          name={restaurant.name}
          star={restaurant.star}
          place={restaurant.place}
        />
      </div>

      {/* Menu Section */}
      <MenuSection
        menus={restaurant.menus || []}
        onAddToCart={handleAddToCart}
      />

      {/* Review Section */}
      <div className='px-4 sm:px-6 lg:px-8'>
        <ReviewSection
          reviews={restaurant.reviews || []}
          averageRating={restaurant.star}
          totalReviews={restaurant.reviewCount}
        />
      </div>
    </div>
  );
}
