import { Star, Clock } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { Restaurant } from '@/types/Restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export default function RestaurantCard({
  restaurant,
  onClick,
}: RestaurantCardProps) {
  return (
    <Card
      className='group cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg'
      onClick={onClick}
    >
      <div className='relative h-48 w-full overflow-hidden'>
        <Image
          src={restaurant.imageUrl || '/images/restaurant-placeholder.jpg'}
          alt={restaurant.name}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-110'
        />
        {restaurant.deliveryTime && (
          <div className='absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm'>
            <Clock className='h-3 w-3' />
            {restaurant.deliveryTime}
          </div>
        )}
      </div>
      <CardContent className='p-4'>
        <div className='mb-2 flex items-start justify-between'>
          <h3 className='line-clamp-1 text-lg font-bold'>{restaurant.name}</h3>
          <div className='flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 text-sm font-bold text-green-700'>
            <Star className='h-3 w-3 fill-current' />
            <span>{restaurant.rating || 'N/A'}</span>
          </div>
        </div>
        <div className='mb-3 flex items-center gap-2 text-sm text-neutral-500'>
          <span>{restaurant.priceRange || '$$'}</span>
          <span>•</span>
          <span className='line-clamp-1'>
            {restaurant.categories?.join(', ') || 'Mixed Cuisine'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
