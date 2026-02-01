'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants';

export function CartEmptyState() {
  return (
    <div className='flex h-80 flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white'>
      <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100'>
        <ShoppingBag className='h-8 w-8 text-neutral-400' />
      </div>
      <h3 className='text-lg-custom mb-2 font-bold'>Your cart is empty</h3>
      <p className='text-md-custom mb-6 text-neutral-500'>
        Explore restaurants and add some delicious food!
      </p>
      <Link href={ROUTES.RESTAURANTS}>
        <Button className='text-white'>Browse Restaurants</Button>
      </Link>
    </div>
  );
}
