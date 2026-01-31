'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface RestaurantHeroProps {
  images: string[];
  name: string;
}

export default function RestaurantHero({ images, name }: RestaurantHeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ensure we have at least 4 images, fill with placeholder if needed
  const displayImages = [...images];
  while (displayImages.length < 4) {
    displayImages.push('/images/restaurant-placeholder.jpg');
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(
        scrollRef.current.scrollLeft / scrollRef.current.clientWidth
      );
      if (index !== activeSlide) {
        setActiveSlide(index);
      }
    }
  };

  return (
    <section className='w-full'>
      {/* Mobile View: Slider */}
      <div className='relative md:hidden'>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className='flex w-full snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayImages.map((image, index) => (
            <div
              key={index}
              className='relative h-[250px] min-w-full shrink-0 snap-center overflow-hidden'
            >
              <Image
                src={image}
                alt={`${name} - Slide ${index + 1}`}
                fill
                priority={index === 0}
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 50vw'
              />
            </div>
          ))}
        </div>

        {/* Dot Navigation */}
        <div className='absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2'>
          {displayImages.map((_, index) => (
            <div
              key={index}
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({
                    left: index * scrollRef.current.clientWidth,
                    behavior: 'smooth',
                  });
                }
              }}
              className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                activeSlide === index
                  ? 'bg-primary w-4'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop View: Grid */}
      <div className='hidden h-[300px] grid-cols-2 gap-2 sm:h-[400px] md:grid md:h-[500px] lg:gap-4'>
        {/* Main large image - left side */}
        <div className='relative overflow-hidden rounded-xl lg:rounded-2xl'>
          <Image
            src={displayImages[0]}
            alt={`${name} - Main`}
            fill
            priority
            className='object-cover transition-transform duration-500 hover:scale-105'
            sizes='(max-width: 768px) 50vw, 40vw'
          />
        </div>

        {/* Right side - 3 images grid */}
        <div className='grid grid-rows-2 gap-2 lg:gap-4'>
          {/* Top right - medium image */}
          <div className='relative overflow-hidden rounded-xl lg:rounded-2xl'>
            <Image
              src={displayImages[1]}
              alt={`${name} - Gallery 1`}
              fill
              className='object-cover transition-transform duration-500 hover:scale-105'
              sizes='(max-width: 768px) 50vw, 30vw'
            />
          </div>

          {/* Bottom right - 2 small images */}
          <div className='grid grid-cols-2 gap-2 lg:gap-4'>
            <div className='relative overflow-hidden rounded-xl lg:rounded-2xl'>
              <Image
                src={displayImages[2]}
                alt={`${name} - Gallery 2`}
                fill
                className='object-cover transition-transform duration-500 hover:scale-105'
                sizes='(max-width: 768px) 25vw, 15vw'
              />
            </div>
            <div className='relative overflow-hidden rounded-xl lg:rounded-2xl'>
              <Image
                src={displayImages[3]}
                alt={`${name} - Gallery 3`}
                fill
                className='object-cover transition-transform duration-500 hover:scale-105'
                sizes='(max-width: 768px) 25vw, 15vw'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
