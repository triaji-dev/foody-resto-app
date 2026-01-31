'use client';

import Image from 'next/image';
import { Star, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RestaurantInfoProps {
  logo: string;
  name: string;
  star: number;
  place: string;
  distance?: string;
  onShare?: () => void;
}

export default function RestaurantInfo({
  logo,
  name,
  star,
  place,
  distance,
  onShare,
}: RestaurantInfoProps) {
  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }

    // Default share behavior
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name} on Foody!`,
          url: window.location.href,
        });
      } catch (error) {
        // Don't log if user cancelled sharing
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: copy link to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <section className='flex items-center justify-between py-6'>
      <div className='flex items-center gap-4'>
        {/* Restaurant Logo */}
        <div className='relative h-16 w-16 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm md:h-20 md:w-20'>
          <Image
            src={logo || '/images/restaurant-placeholder.jpg'}
            alt={`${name} logo`}
            fill
            sizes='80px'
            className='object-contain p-1'
          />
        </div>

        {/* Restaurant Details */}
        <div className='flex flex-col gap-1'>
          <h1 className='display-sm md:display-md font-extrabold text-neutral-900'>
            {name}
          </h1>
          <div className='flex items-center gap-2'>
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            <span className='text-sm-custom font-medium text-neutral-700'>
              {star.toFixed(1)}
            </span>
          </div>
          <p className='text-sm-custom text-neutral-600'>
            {place}
            {distance && ` · ${distance}`}
          </p>
        </div>
      </div>

      {/* Share Button */}
      <Button
        variant='outline'
        size='sm'
        onClick={handleShare}
        className='gap-2 rounded-full px-4'
      >
        <Share2 className='h-4 w-4' />
        <span className='hidden sm:inline'>Share</span>
      </Button>
    </section>
  );
}
