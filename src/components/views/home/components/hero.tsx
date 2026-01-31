'use client';

import { useState } from 'react';
import Image from 'next/image';
import Searchbar from '@/components/views/home/components/searchbar';

interface HeroProps {
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
}

function Hero({ onSearch, onClearSearch }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className='relative flex min-h-[500px] w-full items-center justify-center sm:h-screen sm:min-h-[650px] md:max-h-[827px] 2xl:max-h-[927px]'>
      <div
        className={`absolute inset-0 z-0 animate-pulse bg-gray-950 ${isLoaded ? 'hidden' : 'block'}`}
      />
      <Image
        src='/images/hero-background.png'
        alt='Hero background'
        fill
        priority
        className={`object-cover object-center transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        sizes='100vw'
        onLoad={() => setIsLoaded(true)}
      />
      <div
        className={`absolute inset-0 ${isLoaded ? 'bg-linear-to-b from-black/20 via-black/40 to-black/60' : 'bg-linear-to-b from-black/90 via-black/80 to-black/70'}`}
      ></div>
      <div className='relative z-10 mx-auto max-w-4xl space-y-10 px-6 text-center text-white'>
        <div className='animate-in fade-in slide-in-from-bottom-8 duration-1000'>
          <h1 className='display-lg sm:display-2xl mb-2 font-extrabold'>
            Explore Culinary Experiences
          </h1>
          <p className='sm:display-xs text-lg-custom font-bold text-white opacity-90 delay-300'>
            Search and refine your choice to discover the perfect restaurant.
          </p>
        </div>
        <Searchbar onSearch={onSearch} onClear={onClearSearch} />
      </div>
    </div>
  );
}

export default Hero;
