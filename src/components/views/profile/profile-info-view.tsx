'use client';

import { useAuth } from '@/features/auth';
import { AvatarWithInitials } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ProfileInfoView() {
  const { user } = useAuth();

  return (
    <div className='flex-1 space-y-6'>
      <div className='mb-2'>
        <h2 className='text-3xl font-extrabold text-neutral-900'>Profile</h2>
      </div>

      <Card className='rounded-3xl border-none shadow-sm md:border md:border-neutral-100'>
        <CardContent className='flex flex-col items-start gap-8 p-8'>
          {/* User Avatar & Name */}
          <div className='flex items-center gap-4'>
            <AvatarWithInitials
              src={user?.avatar}
              name={user?.name || 'User'}
              size='lg'
              className='h-20 w-20 border-2 border-neutral-100'
            />
          </div>

          {/* Details Grid */}
          <div className='grid w-full gap-y-6'>
            <div className='flex justify-between border-b border-neutral-100 pb-2'>
              <span className='font-medium text-neutral-500'>Name</span>
              <span className='font-bold text-neutral-900'>
                {user?.name || 'Johndoe'}
              </span>
            </div>
            <div className='flex justify-between border-b border-neutral-100 pb-2'>
              <span className='font-medium text-neutral-500'>Email</span>
              <span className='font-bold text-neutral-900'>
                {user?.email || 'johndoe@email.com'}
              </span>
            </div>
            <div className='flex justify-between border-b border-neutral-100 pb-2'>
              <span className='font-medium text-neutral-500'>
                Nomor Handphone
              </span>
              <span className='font-bold text-neutral-900'>
                {user?.phone || '081234567890'}
              </span>
            </div>
          </div>

          <Button className='w-full rounded-full bg-[#c12116] py-6 text-base font-bold text-white hover:bg-[#a11b12]'>
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
