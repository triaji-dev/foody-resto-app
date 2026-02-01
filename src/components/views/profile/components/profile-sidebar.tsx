'use client';

import { useAuth } from '@/features/auth';
import { Card, CardContent } from '@/components/ui/card';
import { AvatarWithInitials } from '@/components/ui/avatar';
import { ROUTES } from '@/constants/routes';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const navItems = [
  {
    label: 'Delivery Address',
    icon: '/icons/delivery-address.svg',
    href: ROUTES.PROFILE,
  },
  {
    label: 'My Orders',
    icon: '/icons/my-orders.svg',
    href: ROUTES.ORDERS,
  },
];

export function ProfileSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  return (
    <Card className='h-fit border-none shadow-none md:border md:border-neutral-200 md:shadow-sm'>
      <CardContent>
        {/* Profile Section */}
        <div className='mb-6 hidden flex-row items-center gap-4 md:flex'>
          <AvatarWithInitials
            src={user?.avatar}
            name={user?.name || 'User'}
            size='lg'
            className='border border-neutral-200'
          />
          <div className='overflow-hidden'>
            <h3 className='text-lg-custom truncate font-bold text-neutral-900'>
              {user?.name || 'User'}
            </h3>
          </div>
        </div>

        <Separator className='mb-6' />

        {/* Navigation */}
        <nav className='flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible'>
          {navItems.map((item) => {
            const isActive =
              item.href === ROUTES.PROFILE
                ? pathname === ROUTES.PROFILE
                : pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-primary bg-red-50'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className='h-5 w-5'
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900'
          >
            <Image
              src='/icons/logout.svg'
              alt='Logout'
              width={20}
              height={20}
              className='h-5 w-5'
            />
            <span>Logout</span>
          </button>
        </nav>
      </CardContent>
    </Card>
  );
}
