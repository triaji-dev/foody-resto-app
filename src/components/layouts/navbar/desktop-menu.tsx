'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/use-auth';
import { ROUTES } from '@/constants/routes';
import { USER_DROPDOWN_ITEMS, type NavMenuItem } from '@/constants/navbar';
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
import { Home } from 'lucide-react';

interface DesktopMenuProps {
  isScrolled?: boolean;
}

const IconMap: Record<string, React.FC> = {
  Home: MenuIcons.Home,
  Restaurant: MenuIcons.Restaurant,
  Cart: MenuIcons.Cart,
  Orders: MenuIcons.Orders,
  DeliveryAddress: MenuIcons.DeliveryAddress,
  Logout: MenuIcons.Logout,
};

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

  return (
    <div className='hidden md:block'>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-3 space-x-2 rounded-md px-3 transition-transform duration-200 hover:scale-102 focus:scale-95 focus:ring-0 focus:outline-none active:scale-95',
              isScrolled ? 'text-foreground' : 'text-white'
            )}
          >
            <div className='flex cursor-pointer items-center justify-center transition-transform hover:scale-110'>
              <AvatarWithInitials
                src={user?.avatar}
                alt={user?.name || 'Avatar'}
                name={user?.name}
                size='lg'
                className='shadow-[0_2px_12px_rgba(0,0,0,0.1)]'
                isScrolled={isScrolled}
              />
            </div>

            <div className='text-lg-custom cursor-pointer font-semibold transition-transform hover:scale-110'>
              {user?.name || 'User'}
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='w-64' align='end' sideOffset={5}>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex items-center gap-4 p-2'>
              <AvatarWithInitials
                src={user?.avatar}
                alt={user?.name || 'Profile'}
                name={user?.name}
                size='md'
              />
              <p className='text-base leading-none font-semibold'>
                {user?.name || 'User'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {USER_DROPDOWN_ITEMS.map((item, index) =>
              renderMenuItem(item, index)
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DesktopMenu;
