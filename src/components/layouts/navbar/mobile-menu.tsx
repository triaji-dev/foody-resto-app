'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/use-auth';
import {
  ROUTES,
  AUTHENTICATED_MENU_ITEMS,
  GUEST_MENU_ITEMS,
  type NavMenuItem,
} from '@/constants';
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

const IconMap: Record<string, React.FC> = {
  Home: MenuIcons.Home,
  Restaurant: MenuIcons.Restaurant,
  Cart: MenuIcons.Cart,
  Orders: MenuIcons.Orders,
  SignIn: MenuIcons.SignIn,
  SignUp: MenuIcons.SignUp,
  Logout: MenuIcons.Logout,
};

function MobileMenu({ isScrolled = false }: MobileMenuProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const renderMenuItem = (item: NavMenuItem, index: number) => {
    if (item.type === 'separator') {
      return <DropdownMenuSeparator key={`sep-${index}`} />;
    }

    const Icon = item.icon ? IconMap[item.icon] : null;

    if (item.type === 'logout') {
      return (
        <DropdownMenuItem
          key={item.label}
          onClick={handleLogout}
          className='text-destructive focus:text-destructive cursor-pointer'
        >
          {Icon && <Icon />}
          {item.label}
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem
        key={item.label}
        onClick={() => item.href && router.push(item.href)}
        className='cursor-pointer'
      >
        {Icon && <Icon />}
        {item.label}
      </DropdownMenuItem>
    );
  };

  const menuItems = isAuthenticated
    ? AUTHENTICATED_MENU_ITEMS
    : GUEST_MENU_ITEMS;

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
                  className='shadow-[0_2px_12px_rgba(0,0,0,0.1)]'
                  isScrolled={isScrolled}
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
          {isAuthenticated && (
            <>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex items-center space-x-3'>
                  <AvatarWithInitials
                    src={user?.avatarUrl}
                    alt={user?.name || 'Profile'}
                    name={user?.name}
                    size='sm'
                    className='mr-2'
                  />
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
            </>
          )}

          {!isAuthenticated && (
            <>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuGroup>
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default MobileMenu;
