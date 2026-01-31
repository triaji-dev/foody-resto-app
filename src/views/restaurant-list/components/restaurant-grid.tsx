'use client';

import RestaurantCard from '@/components/ui/restaurant-card';
import type { Restaurant } from '@/types/api';

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2'>
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={() => console.log('Restaurant clicked:', restaurant.id)}
        />
      ))}
    </div>
  );
}
