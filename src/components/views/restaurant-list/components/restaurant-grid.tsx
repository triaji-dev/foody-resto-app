'use client';

import { useRouter } from 'next/navigation';
import RestaurantCard from '@/components/ui/restaurant-card';
import type { Restaurant } from '@/types/api';

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  const router = useRouter();

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-2 xl:grid-cols-2'>
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={() => router.push(`/restaurant/${restaurant.id}`)}
        />
      ))}
    </div>
  );
}
