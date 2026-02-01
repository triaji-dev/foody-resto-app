'use client';

import { useRestaurantDetail } from '@/features/restaurant';
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
    data: restaurant,
    isLoading,
    error,
  } = useRestaurantDetail(restaurantId);

  const { addToCart, isAdding } = useCart(false);

  const handleAddToCart = (menuId: number, quantity: number) => {
    // Only call API for positive quantities (adding items)
    // Decrease is handled locally in UI; cart page handles actual removal
    if (quantity > 0) {
      addToCart({ menuId, quantity, restaurantId });
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-white px-4 py-4 pt-20 md:px-[120px] md:py-8 md:pt-24'>
        {/* Hero Skeleton */}
        <div className='mb-4 md:mb-8'>
          <div className='hidden gap-5 md:flex' style={{ height: '470px' }}>
            <div className='w-[55%] animate-pulse rounded-2xl bg-neutral-200' />
            <div className='flex flex-1 flex-col gap-5'>
              <div className='h-[302px] animate-pulse rounded-2xl bg-neutral-200' />
              <div className='flex flex-1 gap-5'>
                <div className='flex-1 animate-pulse rounded-2xl bg-neutral-200' />
                <div className='flex-1 animate-pulse rounded-2xl bg-neutral-200' />
              </div>
            </div>
          </div>
          <div className='md:hidden'>
            <div className='mx-auto h-[260px] max-w-[361px] animate-pulse rounded-2xl bg-neutral-200' />
          </div>
        </div>

        {/* Info Skeleton */}
        <div className='mb-4 md:mb-8'>
          <div className='flex items-center gap-4'>
            <div className='h-20 w-20 animate-pulse rounded-full bg-neutral-200 md:h-[120px] md:w-[120px]' />
            <div className='flex flex-col gap-2'>
              <div className='h-6 w-32 animate-pulse rounded bg-neutral-200 md:h-8 md:w-48' />
              <div className='h-4 w-16 animate-pulse rounded bg-neutral-200 md:w-24' />
              <div className='h-4 w-24 animate-pulse rounded bg-neutral-200 md:w-32' />
            </div>
          </div>
        </div>

        {/* Menu Skeleton */}
        <div className='mb-4 md:mb-8'>
          <div className='mb-4 h-8 w-24 animate-pulse rounded bg-neutral-200 md:mb-6 md:h-10 md:w-32' />
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className='aspect-[1/1.3] animate-pulse rounded-2xl bg-neutral-200'
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white px-4 pt-16 md:pt-20'>
        <div className='text-center'>
          <h1 className='text-2xl font-extrabold text-gray-900 md:text-3xl'>
            Restaurant Not Found
          </h1>
          <p className='mt-2 text-base text-gray-600'>
            The restaurant you&apos;re looking for doesn&apos;t exist or has
            been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white px-4 py-4 pt-20 md:px-[120px] md:py-8 md:pt-24'>
      {/* Hero Image Gallery */}
      <div className='mb-4 md:mb-8'>
        <RestaurantHero images={restaurant.images} name={restaurant.name} />
      </div>

      {/* Restaurant Info */}
      <div className='mb-4 md:mb-8'>
        <RestaurantInfo
          logo={restaurant.logo}
          name={restaurant.name}
          star={restaurant.star}
          place={restaurant.place}
        />
      </div>

      {/* Divider */}
      <div className='mb-4 h-px w-full bg-[#D5D7DA] md:mb-8' />

      {/* Menu Section */}
      <MenuSection
        menus={restaurant.menus || []}
        onAddToCart={handleAddToCart}
      />

      {/* Divider */}
      <div className='my-4 h-px w-full bg-[#D5D7DA] md:my-8' />

      {/* Review Section */}
      <ReviewSection
        reviews={restaurant.reviews || []}
        averageRating={restaurant.star}
        totalReviews={restaurant.reviewCount}
      />
    </div>
  );
}
