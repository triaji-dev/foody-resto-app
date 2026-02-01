'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { ROUTES } from '@/constants';

export function CartEmptyState() {
  return (
    <div className='flex w-full flex-col items-center justify-center rounded-2xl bg-white p-16 shadow-lg'>
      <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
        <ShoppingBag className='h-8 w-8 text-gray-400' />
      </div>
      <h3 className='mb-2 text-lg font-bold text-gray-900'>
        Your cart is empty
      </h3>
      <p className='mb-6 text-base text-gray-500'>
        Explore restaurants and add some delicious food!
      </p>
      <Link href={ROUTES.RESTAURANTS}>
        <button className='cursor-pointer rounded-full bg-[#C12116] px-8 py-3 font-bold text-white transition-colors hover:bg-[#B01E14]'>
          Start Shopping
        </button>
      </Link>
    </div>
  );
}
