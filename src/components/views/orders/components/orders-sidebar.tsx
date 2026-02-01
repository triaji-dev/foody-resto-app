'use client';

import { useAuth } from '@/features/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AvatarWithInitials } from '@/components/ui/avatar';
import { MapPin, ShoppingBag, LogOut } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function OrdersSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  const navItems = [
    {
      label: 'Delivery Address',
      icon: MapPin,
      href: ROUTES.CHECKOUT, // Or a dedicated profile/address page if it existed
      active: false,
    },
    {
      label: 'My Orders',
      icon: ShoppingBag,
      href: ROUTES.ORDERS,
      active: true, // We are on orders page
    },
  ];

  return (
    <Card className='h-fit border-none shadow-none md:border md:border-neutral-200 md:shadow-sm'>
      <CardContent className='p-0 md:p-6'>
        {/* Profile Section */}
        <div className='mb-6 hidden flex-row items-center gap-4 md:flex'>
          <AvatarWithInitials
            src={user?.avatar}
            name={user?.name || 'User'}
            size='lg'
            className='border border-neutral-200'
          />
          <div className='overflow-hidden'>
            <h3 className='truncate font-bold text-neutral-900'>
              {user?.name || 'User'}
            </h3>
            <p className='truncate text-xs text-neutral-500'>
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        <div className='mb-6 hidden h-px bg-neutral-100 md:block' />

        {/* Navigation */}
        <nav className='flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible'>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                item.active
                  ? 'text-primary bg-red-50'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              )}
            >
              <item.icon
                className={cn(
                  'h-5 w-5',
                  item.active ? 'text-primary' : 'text-neutral-400'
                )}
              />
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900'
          >
            <LogOut className='h-5 w-5 text-neutral-400' />
            <span>Logout</span>
          </button>
        </nav>
      </CardContent>
    </Card>
  );
}
