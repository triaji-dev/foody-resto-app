'use client';

import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/services/cart';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (
    id: number,
    currentQuantity: number,
    change: number
  ) => void;
  onDelete: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onDelete,
  isUpdating,
  isDeleting,
}: CartItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className='flex items-start gap-4'>
      <div className='relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-100'>
        <Image
          src={item.menu.image || '/images/menu-placeholder.jpg'}
          alt={item.menu.foodName}
          fill
          className='object-cover'
          sizes='80px'
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-start justify-between'>
          <h4 className='text-md-custom font-semibold'>{item.menu.foodName}</h4>
          <button
            onClick={() => onDelete(item.id)}
            className='cursor-pointer text-neutral-400 transition-colors hover:text-red-500'
            disabled={isDeleting}
          >
            <Trash2 className='h-4 w-4' />
          </button>
        </div>
        <p className='text-primary text-sm-custom mt-1 font-medium'>
          {formatPrice(item.menu.price)}
        </p>

        <div className='mt-3 flex items-center gap-3'>
          <Button
            variant='outline'
            size='sm'
            className='h-8 w-8 rounded-full p-0'
            onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
            disabled={isUpdating}
          >
            <Minus className='h-3 w-3' />
          </Button>
          <span className='text-sm-custom w-8 text-center font-medium'>
            {item.quantity}
          </span>
          <Button
            variant='outline'
            size='sm'
            className='h-8 w-8 rounded-full p-0'
            onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
            disabled={isUpdating}
          >
            <Plus className='h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  );
}
