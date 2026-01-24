'use client';

import { motion } from 'motion/react';
import { useScreenSize } from '@/hooks/use-screen-size';
import Searchbar from './searchbar';

interface HeroProps {
  onSearch?: (query: string) => void;
  onClearSearch?: () => void;
}

function Hero({ onSearch, onClearSearch }: HeroProps) {
  const { isAtLeast } = useScreenSize();

  const getTitleSize = () => {
    if (isAtLeast('sm')) return 'display-2xl-extrabold';
    return 'display-lg-extrabold';
  };

  const getSubtitleSize = () => {
    if (isAtLeast('sm')) return 'text-xl-medium';
    return 'text-lg-medium';
  };

  return (
    <div
      className='relative flex min-h-[650px] w-full items-center justify-center bg-cover bg-center bg-no-repeat sm:h-screen'
      style={{ backgroundImage: "url('/images/hero-background.png')" }}
    >
      <div className='absolute inset-0 bg-black/40'></div>
      <div className='relative z-10 mx-auto max-w-4xl px-6 text-center text-white'>
        <motion.h1
          className={`${getTitleSize()} mb-6 leading-tight`}
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
          className={`${getSubtitleSize()} mb-8 text-neutral-200`}
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
        <Searchbar onSearch={onSearch} onClear={onClearSearch} />
      </div>
    </div>
  );
}

export default Hero;
