'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/use-auth';
import { ROUTES } from '@/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MenuIcons } from './menu-icons';
import { AvatarWithInitials } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface DesktopMenuProps {
  isScrolled?: boolean;
}

function DesktopMenu({ isScrolled = false }: DesktopMenuProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='hidden md:block'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-3 space-x-2 rounded-md px-3 py-2 transition-transform duration-200 hover:scale-102 focus:scale-95 focus:ring-0 focus:outline-none active:scale-95',
              isScrolled ? 'text-foreground' : 'text-white'
            )}
          >
            {/* Avatar and Username */}
            <div className='flex cursor-pointer items-center justify-center transition-transform hover:scale-110'>
              <AvatarWithInitials
                src={user?.avatarUrl}
                alt={user?.name || 'Avatar'}
                name={user?.name}
                size='lg'
                className='shadow-lg'
              />
            </div>

            <div className='text-lg-semibold cursor-pointer transition-transform hover:scale-110'>
              {user?.name || 'User'}
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='w-64' align='end' sideOffset={5}>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex items-center space-x-3'>
              <MenuIcons.Profile user={user || undefined} />
              <div className='flex flex-col space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {user?.name || 'User'}
                </p>
                <p className='text-muted-foreground text-xs leading-none'>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => router.push(ROUTES.HOME)}
              className='cursor-pointer'
            >
              <MenuIcons.Home />
              Home
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push(ROUTES.RESTAURANTS)}
              className='cursor-pointer'
            >
              <MenuIcons.Restaurant />
              Restaurants
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push(ROUTES.CART)}
              className='cursor-pointer'
            >
              <MenuIcons.Cart />
              Cart
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push(ROUTES.ORDERS)}
              className='cursor-pointer'
            >
              <MenuIcons.Orders />
              Orders
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className='text-destructive focus:text-destructive cursor-pointer'
          >
            <MenuIcons.Logout />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DesktopMenu;
