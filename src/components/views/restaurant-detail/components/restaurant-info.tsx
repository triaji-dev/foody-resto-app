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
        <div className='relative h-20 w-20 overflow-hidden rounded-full border border-neutral-200 bg-white shadow-sm md:h-[120px] md:w-[120px]'>
          <Image
            src={logo || '/images/restaurant-placeholder.jpg'}
            alt={`${name} logo`}
            fill
            sizes='(max-width: 768px) 80px, 120px'
            className='object-cover'
          />
        </div>

        {/* Restaurant Details */}
        <div className='flex flex-col gap-1'>
          <h1 className='md:display-md text-lg font-extrabold text-neutral-900'>
            {name}
          </h1>
          <div className='flex items-center gap-2'>
            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
            <span className='text-sm-custom md:text-md-custom font-medium text-neutral-700'>
              {star.toFixed(1)}
            </span>
          </div>
          <p className='md:text-md text-sm text-neutral-600'>
            {place}
            {distance && ` · ${distance}`}
          </p>
        </div>
      </div>

      <Button
        variant='outline'
        size='none'
        onClick={handleShare}
        className='text-md-custom gap-2 rounded-full px-3 py-3 font-bold transition-all duration-200 ease-in-out hover:scale-105 md:px-7.5 md:py-3'
      >
        <Share2 className='h-5 w-5 shrink-0 md:hidden' />
        <Share2 className='hidden h-6 w-6 shrink-0 md:block' />
        <span className='hidden sm:inline'>Share</span>
      </Button>
    </section>
  );
}
