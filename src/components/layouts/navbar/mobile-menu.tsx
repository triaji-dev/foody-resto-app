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

interface MobileMenuProps {
  isScrolled?: boolean;
}

function MobileMenu({ isScrolled = false }: MobileMenuProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const handleSignIn = () => {
    router.push(ROUTES.AUTH_LOGIN);
  };

  const handleSignUp = () => {
    router.push(ROUTES.AUTH_REGISTER);
  };

  const handleLogout = () => {
    router.push(ROUTES.HOME);
  };

  return (
    <div className='md:hidden'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-md transition-transform hover:scale-105 focus:ring-0 focus:outline-none active:scale-95',
              isScrolled ? 'text-foreground' : 'text-white'
            )}
          >
            {isAuthenticated ? (
              <div className='transition-transform hover:scale-105'>
                <AvatarWithInitials
                  src={user?.avatarUrl}
                  alt={user?.name || 'Avatar'}
                  name={user?.name}
                  size='md'
                />
              </div>
            ) : (
              <svg
                className='h-8 w-8 cursor-pointer'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='mr-4 w-56' align='end' sideOffset={5}>
          {isAuthenticated ? (
            <>
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
            </>
          ) : (
            <>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleSignIn}
                  className='cursor-pointer'
                >
                  <MenuIcons.SignIn />
                  Sign In
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleSignUp}
                  className='cursor-pointer'
                >
                  <MenuIcons.SignUp />
                  Sign Up
                </DropdownMenuItem>
              </DropdownMenuGroup>

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
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default MobileMenu;
