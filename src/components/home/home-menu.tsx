'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useScreenSize } from '@/hooks/use-screen-size';

// Temporary mock icons assuming they exist in public/icons or use placeholders
const homeMenuData = [
  {
    title: 'All Restaurants',
    href: '#',
    icon: '/icons/utensils-crossed.svg', // Changed to likely available or fallback
  },
  {
    title: 'Nearby',
    href: '#',
    icon: '/icons/map-pin.svg',
  },
  {
    title: 'Discount',
    href: '#',
    icon: '/icons/percent.svg',
  },
  {
    title: 'Best Seller',
    href: '#',
    icon: '/icons/award.svg',
  },
  {
    title: 'Delivery',
    href: '#',
    icon: '/icons/truck.svg',
  },
  {
    title: 'Lunch',
    href: '#',
    icon: '/icons/soup.svg',
  },
];

function HomeMenu() {
  const { isMobile, isTablet } = useScreenSize();

  // Dynamic text sizing based on screen size
  const getTextSize = () => {
    if (isMobile) return 'text-xs font-bold';
    if (isTablet) return 'text-lg font-bold';
    return 'text-base font-bold';
  };

  // Dynamic icon size based on screen size
  const getIconSize = () => {
    if (isMobile) return 'h-8 w-8'; // Reduced size as real SVGs might be smaller
    if (isTablet) return 'h-12 w-12';
    return 'h-10 w-10';
  };

  return (
    <div className='mx-auto mt-16 mb-16 grid w-full max-w-7xl grid-cols-3 gap-0 sm:mt-8 sm:gap-0 lg:grid-cols-6'>
      {homeMenuData.map((item) => (
        <motion.div
          key={item.title}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Link
            href={item.href}
            className='flex flex-col items-center space-y-2 rounded-lg p-3 transition-colors duration-200 sm:p-6'
          >
            <motion.div
              className='flex h-20 w-full items-center justify-center rounded-2xl bg-white p-3 shadow-lg transition-colors duration-200'
              style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 0 25px rgba(0, 0, 0, 0.15)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {/* Using simple div/svg placeholders if image doesn't exist */}
              <div
                className={`${getIconSize()} bg-primary/20 flex items-center justify-center rounded-full`}
              >
                {/* Placeholder icon */}
                <span className='text-primary text-xl font-bold'>
                  {item.title[0]}
                </span>
              </div>
            </motion.div>
            <motion.span
              className={`${getTextSize()} text-center`}
              whileHover={{ scale: 1.05, color: 'var(--primary)' }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {item.title}
            </motion.span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

export default HomeMenu;
