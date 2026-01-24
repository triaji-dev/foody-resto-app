'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useScreenSize } from '@/hooks/use-screen-size';

const homeMenuData = [
  {
    title: 'All Restaurants',
    href: '#',
    icon: '/icons/all-restaurants-icon.png',
  },
  {
    title: 'Nearby',
    href: '#',
    icon: '/icons/nearby-icon.png',
  },
  {
    title: 'Discount',
    href: '#',
    icon: '/icons/discount-icon.png',
  },
  {
    title: 'Best Seller',
    href: '#',
    icon: '/icons/best-seller-icon.png',
  },
  {
    title: 'Delivery',
    href: '#',
    icon: '/icons/delivery-icon.png',
  },
  {
    title: 'Lunch',
    href: '#',
    icon: '/icons/lunch-icon.png',
  },
];

function HomeMenu() {
  const { isMobile, isTablet } = useScreenSize();

  const getTextSize = () => {
    if (isMobile) return 'text-sm-bold';
    if (isTablet) return 'text-md-bold';
    return 'text-lg-bold';
  };

  const getIconSize = () => {
    if (isMobile) return 'h-12 w-12';
    if (isTablet) return 'h-14 w-14';
    return 'h-16 w-16';
  };

  return (
    <div className='mx-5 md:mx-30 mt-6 mb-16 grid grid-cols-3 gap-5 sm:mt-12 sm:gap-12 lg:grid-cols-6'>
      {homeMenuData.map((item) => (
        <motion.div
          key={item.title}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <Link
            href={item.href}
            className='flex flex-col items-center space-y-2 rounded-lg transition-colors duration-200'
          >
            <motion.div
              className='flex h-25 w-full items-center justify-center rounded-2xl bg-white p-3 shadow-[0_0_10px_rgba(0,0,0,0.05)] transition-colors duration-200'
              whileHover={{
                scale: 1.02,
                boxShadow: '0 0 25px rgba(0, 0, 0, 0.15)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.img
                src={item.icon}
                alt={item.title}
                className={getIconSize()}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400 }}
              />
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
