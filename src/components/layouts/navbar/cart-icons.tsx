'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import Image from 'next/image';

interface NavIconProps {
  icon: React.ReactElement;
  onClick: () => void;
  label: string;
}

const NavIcon = ({ icon, onClick, label }: NavIconProps) => (
  <div
    className='group relative flex cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95'
    onClick={onClick}
    title={label}
  >
    {icon}
  </div>
);

export const CartIcons = ({ isScrolled }: { isScrolled?: boolean }) => {
  const router = useRouter();

  const navigationItems = [
    {
      icon: (
        <Image
          src='/icons/cart.svg'
          alt='Cart'
          width={24}
          height={24}
          className='h-5 w-5 drop-shadow-sm sm:h-6 sm:w-6'
          style={{
            filter: isScrolled
              ? 'brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)'
              : 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
          }}
        />
      ),
      route: ROUTES.CART,
      label: 'Cart',
    },
  ];

  return (
    <div className='flex items-center gap-3'>
      {navigationItems.map((item, index) => (
        <NavIcon
          key={index}
          icon={item.icon}
          onClick={() => router.push(item.route)}
          label={item.label}
        />
      ))}
    </div>
  );
};
