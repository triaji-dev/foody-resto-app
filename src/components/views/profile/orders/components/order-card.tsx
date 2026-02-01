'use client';

import { Order } from '@/types/api';
import { formatCurrency } from '@/lib/format';
import { Package } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: Order;
  onReview: (order: Order) => void;
}

export function OrderCard({ order, onReview }: OrderCardProps) {
  return (
    <div className='flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-md'>
      {/* Header: Restaurant */}
      <div className='mb-4 flex items-center gap-3'>
        <div className='flex h-10 w-10 items-center justify-center rounded bg-orange-100'>
          <Package className='h-5 w-5 text-orange-600' />
        </div>
        <h3 className='text-lg font-bold text-neutral-900'>
          {order.restaurantName}
        </h3>
      </div>

      {/* Body: Items */}
      <div className='space-y-4 border-b border-neutral-100 pb-4'>
        {order.items.map((item, index) => (
          <div key={index} className='flex gap-4'>
            <div className='h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100'>
              <Image
                src={`https://placehold.co/100x100?text=${item.menuName.charAt(0)}`}
                alt={item.menuName}
                width={64}
                height={64}
                className='h-full w-full object-cover'
              />
            </div>
            <div>
              <h4 className='line-clamp-1 font-bold text-neutral-900'>
                {item.menuName}
              </h4>
              <p className='mt-1 text-sm font-medium text-neutral-500'>
                {item.quantity} x {formatCurrency(item.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Total & Action */}
      <div className='mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-neutral-500'>Total</p>
          <p className='text-lg font-bold text-neutral-900'>
            {formatCurrency(order.totalAmount)}
          </p>
        </div>

        {order.status === 'done' && (
          <Button
            onClick={() => onReview(order)}
            className='w-full rounded-full bg-[#c12116] px-8 text-white hover:bg-[#a11b12] sm:w-auto'
          >
            Give Review
          </Button>
        )}
      </div>
    </div>
  );
}
