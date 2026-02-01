'use client';

import { Button } from '@/components/ui/button';
import { CartGroupedItem } from '@/services/cart';

interface CartSummaryProps {
  cartGroups: CartGroupedItem[];
  grandTotal: number;
  onCheckout: () => void;
}

export function CartSummary({
  cartGroups,
  grandTotal,
  onCheckout,
}: CartSummaryProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className='sticky top-24 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'>
      <h3 className='text-lg-custom mb-4 font-bold'>Order Summary</h3>
      <div className='mb-4 space-y-2 border-b border-neutral-100 pb-4'>
        <h4 className='text-sm-custom mb-2 font-semibold text-neutral-500'>
          Subtotal per Restaurant
        </h4>
        {cartGroups.map((group) => (
          <div
            key={group.restaurant.id}
            className='flex items-center justify-between text-sm'
          >
            <span className='max-w-[150px] truncate text-neutral-500'>
              {group.restaurant.name}
            </span>
            <span className='font-medium'>{formatPrice(group.subtotal)}</span>
          </div>
        ))}
      </div>
      <div className='mb-6 flex items-center justify-between'>
        <span className='text-lg-custom font-bold'>Total</span>
        <span className='text-primary text-lg-custom font-bold'>
          {formatPrice(grandTotal)}
        </span>
      </div>
      <Button
        className='w-full cursor-pointer font-bold'
        size='lg'
        onClick={onCheckout}
      >
        Checkout
      </Button>
    </div>
  );
}
