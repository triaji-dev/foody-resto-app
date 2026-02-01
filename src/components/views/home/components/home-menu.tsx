'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useScreenSize } from '@/hooks/use-screen-size';

const homeMenuData = [
  {
    title: 'All Restaurants',
    href: '/restaurants',
    icon: '/icons/all-restaurants-icon.png',
  },
  {
    title: 'Nearby',
    href: '/restaurants?range=10',
    icon: '/icons/nearby-icon.png',
  },
  {
    title: 'Discount',
    href: '/restaurants?category=discount',
    icon: '/icons/discount-icon.png',
  },
  {
    title: 'Best Seller',
    href: '/restaurants?rating=4.5',
    icon: '/icons/best-seller-icon.png',
  },
  {
    title: 'Delivery',
    href: '/restaurants?delivery=true',
    icon: '/icons/delivery-icon.png',
  },
  {
    title: 'Lunch',
    href: '/restaurants?category=lunch',
    icon: '/icons/lunch-icon.png',
  },
];

function HomeMenu() {
  const { isMobile, isTablet } = useScreenSize();

  const getTextSize = () => {
    if (isMobile) return 'text-sm-custom font-bold';
    if (isTablet) return 'text-md-custom font-bold';
    return 'text-lg-custom font-bold';
  };

  const getIconSize = () => {
    if (isMobile) return 'h-12 w-12';
    if (isTablet) return 'h-14 w-14';
    return 'h-16 w-16';
  };

  return (
    <div className='mt-6 mb-16 grid grid-cols-3 gap-[clamp(1.25rem,3.33vw,3rem)] px-4 sm:mt-12 sm:px-[clamp(1rem,8.33vw,7.5rem)] lg:grid-cols-6'>
      {homeMenuData.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className='group flex flex-col items-center space-y-2 rounded-lg'
        >
          <div className='flex h-25 w-full items-center justify-center rounded-2xl bg-white p-3 shadow-[0_0_10px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] group-active:scale-95'>
            <Image
              src={item.icon}
              alt={item.title}
              width={64}
              height={64}
              className={`${getIconSize()} transition-transform duration-300 group-hover:scale-110`}
            />
          </div>
          <span
            className={`${getTextSize()} group-hover:text-primary text-center transition-colors duration-300`}
          >
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

export default HomeMenu;
