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
      {/* Mobile View: Slider with proper dimensions */}
      <div className='md:hidden'>
        <div className='flex flex-col items-center gap-3'>
          {/* Image Container - 361x260 */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className='relative flex w-full max-w-[361px] snap-x snap-mandatory overflow-x-auto rounded-2xl [&::-webkit-scrollbar]:hidden'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayImages.map((image, index) => (
              <div
                key={index}
                className='relative h-[260px] min-w-full shrink-0 snap-center overflow-hidden rounded-2xl'
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

          {/* Pagination Dots */}
          <div className='flex items-center gap-1'>
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current) {
                    scrollRef.current.scrollTo({
                      left: index * scrollRef.current.clientWidth,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                  activeSlide === index ? 'bg-[#C12116]' : 'bg-[#D9D9D9]'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop View: Grid with proper proportions */}
      <div className='hidden md:block'>
        <div className='flex gap-5' style={{ height: '470px' }}>
          {/* Main Image - ~55% width */}
          <div className='relative w-[55%] overflow-hidden rounded-2xl'>
            <Image
              src={displayImages[0]}
              alt={`${name} - Main`}
              fill
              priority
              className='object-cover transition-transform duration-500 hover:scale-105'
              sizes='651px'
            />
          </div>

          {/* Right Side Images - ~45% width */}
          <div className='flex flex-1 flex-col gap-5'>
            {/* Top Image - 302px height */}
            <div className='relative h-[302px] overflow-hidden rounded-2xl'>
              <Image
                src={displayImages[1]}
                alt={`${name} - Gallery 1`}
                fill
                className='object-cover transition-transform duration-500 hover:scale-105'
                sizes='529px'
              />
            </div>

            {/* Bottom Two Images - 148px height */}
            <div className='flex flex-1 gap-5'>
              <div className='relative flex-1 overflow-hidden rounded-2xl'>
                <Image
                  src={displayImages[2]}
                  alt={`${name} - Gallery 2`}
                  fill
                  className='object-cover transition-transform duration-500 hover:scale-105'
                  sizes='255px'
                />
              </div>
              <div className='relative flex-1 overflow-hidden rounded-2xl'>
                <Image
                  src={displayImages[3]}
                  alt={`${name} - Gallery 3`}
                  fill
                  className='object-cover transition-transform duration-500 hover:scale-105'
                  sizes='255px'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
