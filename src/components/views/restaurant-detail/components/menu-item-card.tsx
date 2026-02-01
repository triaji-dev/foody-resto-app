'use client';

import { useState, useRef, type MouseEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Menu } from '@/types/api';

interface MenuItemCardProps {
  menu: Menu;
  onAddToCart?: (menuId: number, quantity: number) => void;
  initialQuantity?: number;
}

// Format price in IDR
function formatPrice(price: number): string {
  return `Rp${price.toLocaleString('id-ID')}`;
}

export default function MenuItemCard({
  menu,
  onAddToCart,
  initialQuantity = 0,
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [imageError, setImageError] = useState(false);
  const isProcessingRef = useRef(false);

  const handleIncrease = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setQuantity((prev) => prev + 1);
    onAddToCart?.(menu.id, 1);

    setTimeout(() => {
      isProcessingRef.current = false;
    }, 300);
  };

  const handleDecrease = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isProcessingRef.current || quantity <= 0) return;
    isProcessingRef.current = true;

    setQuantity((prev) => prev - 1);
    onAddToCart?.(menu.id, -1);

    setTimeout(() => {
      isProcessingRef.current = false;
    }, 300);
  };

  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setQuantity(1);
    onAddToCart?.(menu.id, 1);

    setTimeout(() => {
      isProcessingRef.current = false;
    }, 300);
  };

  return (
    <div
      className='group flex flex-col overflow-hidden rounded-2xl bg-white'
      style={{
        boxShadow: '0px 0px 20px rgba(203, 202, 202, 0.25)',
      }}
    >
      {/* Menu Image */}
      <div className='relative aspect-square w-full overflow-hidden bg-gray-100'>
        {menu.image && !imageError ? (
          <Image
            src={menu.image}
            alt={menu.foodName || menu.name || 'Menu item'}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
            sizes='(max-width: 768px) 172px, 285px'
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='flex h-full flex-col items-center justify-center text-gray-400'>
            <svg
              className='mb-2 h-16 w-16'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                clipRule='evenodd'
              />
            </svg>
            <span className='text-sm font-medium'>No Image</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className='flex flex-col items-start justify-between gap-4 p-3 md:flex-row md:items-center md:p-4'>
        {/* Food Name and Price */}
        <div className='flex flex-col items-start'>
          {/* Food Name - allows 2 lines */}
          <div
            className='line-clamp-2 min-h-[40px] font-[Nunito] text-sm leading-5 font-medium tracking-[-0.02em] text-gray-900 md:min-h-[60px] md:text-base md:leading-[30px]'
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
            }}
            title={menu.foodName || menu.name}
          >
            {menu.foodName || menu.name}
          </div>

          {/* Price */}
          <div className='font-[Nunito] text-base leading-[30px] font-extrabold tracking-[-0.02em] text-gray-900 md:text-lg md:leading-8'>
            {formatPrice(menu.price)}
          </div>
        </div>

        {/* Add Button or Quantity Controls */}
        {quantity === 0 ? (
          <Button
            type='button'
            size='none'
            variant='logo'
            onClick={handleAdd}
            className='h-9 w-full rounded-full bg-[#C12116] p-2 font-[Nunito] text-sm leading-7 font-bold tracking-[-0.02em] text-white hover:bg-[#a01b12] md:h-10 md:w-auto md:px-6 md:text-base md:leading-[30px]'
          >
            Add
          </Button>
        ) : (
          <div className='mx-auto flex items-center justify-center gap-2 md:mx-0'>
            {/* Minus Button */}
            <button
              type='button'
              onClick={handleDecrease}
              className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#D5D7DA] bg-transparent transition-all hover:scale-105 md:h-8 md:w-8'
              aria-label='Decrease quantity'
            >
              <div className='h-0.5 w-2 bg-[#0A0D12]' />
            </button>

            {/* Quantity Display */}
            <div className='flex min-w-4 shrink-0 items-center justify-center font-[Nunito] text-base leading-7 font-semibold tracking-[-0.02em] text-gray-900 md:leading-8'>
              {quantity}
            </div>

            {/* Plus Button */}
            <button
              type='button'
              onClick={handleIncrease}
              className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#C12116] transition-all hover:scale-105 md:h-8 md:w-8'
              aria-label='Increase quantity'
            >
              <div className='relative flex h-4 w-4 items-center justify-center'>
                <div className='absolute h-0.5 w-2 bg-white' />
                <div className='absolute h-2 w-0.5 bg-white' />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
