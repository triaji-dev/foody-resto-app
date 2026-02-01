'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ROUTES } from '@/constants';
import { useAuth } from '@/features/auth';
import { useCart } from '@/features/cart/useCart';

interface NavIconProps {
  icon: React.ReactElement;
  onClick: () => void;
  label: string;
  badge?: number;
}

const NavIcon = ({ icon, onClick, label, badge }: NavIconProps) => (
  <div
    className='group relative flex cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-95'
    onClick={onClick}
    title={label}
  >
    {icon}
    {badge ? (
      <span className='absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm sm:h-5 sm:w-5 sm:text-xs'>
        {badge > 99 ? '99+' : badge}
      </span>
    ) : null}
  </div>
);

export const CartIcons = ({ isScrolled }: { isScrolled?: boolean }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart(isAuthenticated);

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
      badge: totalItems,
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
          badge={item.badge}
        />
      ))}
    </div>
  );
};
