'use client';

import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
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
  isMobile?: boolean;
}

// Format price in IDR
function formatPrice(price: number): string {
  return `Rp${price.toLocaleString('id-ID')}`;
}

export function CartItem({
  item,
  onUpdateQuantity,
  isUpdating,
  isMobile = false,
}: CartItemProps) {
  const handleDecrease = () => onUpdateQuantity(item.id, item.quantity, -1);
  const handleIncrease = () => onUpdateQuantity(item.id, item.quantity, 1);

  return (
    <div className='flex w-full flex-row items-center justify-between'>
      {/* Item Info */}
      <div
        className={`flex flex-1 flex-row items-center ${isMobile ? 'gap-4' : 'gap-6'}`}
      >
        {/* Item Image */}
        <div
          className={`relative shrink-0 overflow-hidden rounded-xl bg-gray-100 ${
            isMobile ? 'h-16 w-16' : 'h-20 w-20'
          }`}
        >
          <Image
            src={item.menu.image || '/images/menu-placeholder.jpg'}
            alt={item.menu.foodName}
            fill
            className='object-cover'
            sizes={isMobile ? '64px' : '80px'}
          />
        </div>

        {/* Item Details */}
        <div className='flex min-w-0 flex-1 flex-col items-start'>
          <div className='w-full truncate font-[Nunito] text-sm leading-7 font-medium text-gray-900'>
            {item.menu.foodName}
          </div>
          <div className='font-[Nunito] text-base leading-[30px] font-extrabold text-gray-900'>
            {formatPrice(item.menu.price)}
          </div>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className='flex shrink-0 flex-row items-center justify-end'>
        <div
          className={`flex flex-row items-center ${isMobile ? 'gap-3' : 'gap-4'}`}
        >
          {/* Minus Button */}
          <button
            onClick={handleDecrease}
            disabled={isUpdating}
            className={`flex cursor-pointer flex-row items-center justify-center rounded-full border border-[#D5D7DA] transition-colors hover:bg-gray-50 disabled:opacity-50 ${
              isMobile ? 'h-7 w-7 p-1.5' : 'h-10 w-10'
            }`}
          >
            <Minus
              className={`text-gray-900 ${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`}
            />
          </button>

          {/* Quantity */}
          <span
            className={`text-center font-[Nunito] leading-[30px] font-semibold tracking-[-0.02em] text-gray-900 ${
              isMobile ? 'min-w-[16px] text-sm' : 'min-w-[20px] text-lg'
            }`}
          >
            {item.quantity}
          </span>

          {/* Plus Button */}
          <button
            onClick={handleIncrease}
            disabled={isUpdating}
            className={`flex flex-row items-center justify-center rounded-full bg-[#C12116] transition-colors hover:bg-[#B01E14] disabled:opacity-50 ${
              isMobile ? 'h-7 w-7 p-1.5' : 'h-10 w-10'
            }`}
          >
            <Plus
              className={`text-white ${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
