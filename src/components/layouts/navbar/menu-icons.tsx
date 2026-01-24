import {
  Home,
  UtensilsCrossed,
  ClipboardList,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { AvatarWithInitials } from '@/components/ui/avatar';
import Image from 'next/image';

export const MenuIcons = {
  Home: () => (
    <div className='mr-2 flex h-5 w-5 items-center justify-center rounded-full'>
      <Home className='h-4 w-4' />
    </div>
  ),

  Restaurant: () => (
    <div className='mr-2 flex h-5 w-5 items-center justify-center rounded-full'>
      <UtensilsCrossed className='h-4 w-4' />
    </div>
  ),

  Cart: ({} = {}) => (
    <div className='mr-2 flex h-5 w-5 items-center justify-center rounded-full'>
      <Image
        src='/icons/cart.svg'
        alt='Cart'
        width={16}
        height={16}
        className='h-4 w-4'
        style={{
          filter:
            'brightness(100) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
        }}
      />
    </div>
  ),

  Orders: () => (
    <div className='mr-2 flex h-5 w-5 items-center justify-center rounded-full'>
      <ClipboardList className='h-4 w-4' />
    </div>
  ),

  SignIn: () => (
    <div className='mr-2 flex h-5 w-5 items-center justify-center rounded-full'>
      <LogIn className='h-4 w-4' />
    </div>
  ),

  SignUp: () => (
    <div className='mr-2 flex h-5 w-5 items-center justify-center rounded-full'>
      <UserPlus className='h-4 w-4' />
    </div>
  ),

  Logout: () => (
    <div className='mr-2 flex h-5 w-5 items-center justify-center rounded-full'>
      <LogOut className='h-4 w-4' />
    </div>
  ),

  Profile: ({
    user,
  }: {
    user?: { avatar?: string; name?: string; email?: string };
  }) => (
    <div className='mr-2'>
      <AvatarWithInitials
        src={user?.avatar}
        alt={user?.name || 'Profile'}
        name={user?.name}
        size='sm'
      />
    </div>
  ),
};
