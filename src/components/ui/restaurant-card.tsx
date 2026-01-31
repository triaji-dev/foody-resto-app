import { Star } from 'lucide-react';
import type { Restaurant } from '@/types/api';
import { useScreenSize } from '@/hooks/use-screen-size';
import { useGeolocationContext } from '@/components/providers/geolocation-provider';

interface RestaurantCardProps {
  restaurant: Restaurant;
  distance?: string;
  onClick?: () => void;
}

function RestaurantCard({
  restaurant,
  distance,
  onClick,
}: RestaurantCardProps) {
  const { calculateRestaurantDistance } = useGeolocationContext();
  const { isMobile, isTablet } = useScreenSize();

  const displayDistance = distance || calculateRestaurantDistance(restaurant);

  const getImageSize = () => {
    if (isMobile) return 'h-20 w-20';
    if (isTablet) return 'h-25 w-25';
    return 'h-30 w-30';
  };

  const getTextSize = () => {
    if (isMobile)
      return {
        name: 'text-md font-extrabold',
        rating: 'text-sm',
        location: 'text-sm text-gray-600',
      };
    return {
      name: 'text-lg font-extrabold',
      rating: 'text-md',
      location: 'text-md text-gray-600',
    };
  };

  const textSizes = getTextSize();

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] transition-all duration-300 hover:scale-[1.04] hover:shadow-md active:scale-[0.95] sm:rounded-2xl ${
        isMobile ? 'p-3' : 'p-4'
      }`}
      onClick={onClick}
    >
      <div
        className={`shrink-0 overflow-hidden rounded-md sm:rounded-xl ${getImageSize()}`}
      >
        <img
          src={
            restaurant.images?.[0] || restaurant.logo || '/icons/bk-logo.png'
          }
          alt={`${restaurant.name || 'Restaurant'} logo`}
          className='h-full w-full object-cover'
          loading='lazy'
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.src === (restaurant.images?.[0] || '')) {
              img.src = restaurant.logo || '/icons/bk-logo.png';
            } else if (
              img.src !==
              window.location.origin + '/icons/bk-logo.png'
            ) {
              img.src = '/icons/bk-logo.png';
            }
          }}
        />
      </div>

      <div className='flex-1'>
        <h3 className={`mb-1 ${textSizes.name}`}>
          {restaurant.name || 'Unknown Restaurant'}
        </h3>

        <div className='mb-1 flex items-center gap-1'>
          <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
          <span className={`${textSizes.rating} font-medium`}>
            {(restaurant.star || 0).toFixed(1)}
          </span>
        </div>

        <div className={`flex items-center gap-2 ${textSizes.location}`}>
          <span>{restaurant.place || 'Unknown location'}</span>
          <span>•</span>
          <span>{displayDistance}</span>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
