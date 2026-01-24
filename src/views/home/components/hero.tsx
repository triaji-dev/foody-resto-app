'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import Searchbar from '@/views/home/components/searchbar';

interface HeroProps {
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
}

function Hero({ onSearch, onClearSearch }: HeroProps) {
  return (
    <div className='relative flex min-h-[650px] w-full items-center justify-center sm:h-screen sm:max-h-[827px]'>
      <Image
        src='/images/hero-background.png'
        alt='Hero background'
        fill
        priority
        className='object-cover object-center'
        sizes='100vw'
      />
      <div className='absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/60'></div>
      <div className='relative z-10 mx-auto max-w-4xl space-y-10 px-6 text-center text-white'>
        <div>
          <motion.h1
            className='display-lg-extrabold sm:display-2xl-extrabold mb-2'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: 'easeOut',
            }}
          >
            Explore Culinary Experiences
          </motion.h1>
          <motion.p
            className='text-lg-bold sm:display-xs-bold text-white'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: 'easeOut',
            }}
          >
            Search and refine your choice to discover the perfect restaurant.
          </motion.p>
        </div>
        <Searchbar onSearch={onSearch} onClear={onClearSearch} />
      </div>
    </div>
  );
}

export default Hero;
