'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Menu } from '@/types/api';

interface MenuItemCardProps {
  menu: Menu;
  onAddToCart?: (menuId: number, quantity: number) => void;
  initialQuantity?: number;
}

// Format price in IDR
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function MenuItemCard({
  menu,
  onAddToCart,
  initialQuantity = 0,
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isAdding, setIsAdding] = useState(false);

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onAddToCart?.(menu.id, newQty);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onAddToCart?.(menu.id, newQty);
    }
  };

  const handleAdd = async () => {
    setIsAdding(true);
    try {
      setQuantity(1);
      onAddToCart?.(menu.id, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className='group flex flex-col overflow-hidden rounded-[16px] bg-white shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)] transition-all hover:shadow-xl'>
      {/* Image section - 285x285 aspect ratio */}
      <div className='relative aspect-square w-full overflow-hidden rounded-t-[16px]'>
        <Image
          src={menu.image || '/images/menu-placeholder.jpg'}
          alt={menu.name || 'Menu item'}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        />
      </div>

      {/* Content section - Frame 14 */}
      <div className='flex items-center justify-between p-4'>
        {/* Text Group - Frame 12 */}
        <div className='flex flex-col items-start'>
          <h4 className='line-clamp-1 font-[Nunito] text-[16px] font-medium tracking-[-0.03em] text-[#0A0D12] opacity-100'>
            {menu.name}
          </h4>
          <span className='font-[Nunito] text-[18px] font-extrabold tracking-[-0.02em] text-[#0A0D12] opacity-100'>
            {formatPrice(menu.price)}
          </span>
        </div>

        {/* Add button or quantity controls - Frame 13 */}
        {quantity > 0 ? (
          <div className='flex items-center gap-1'>
            <button
              onClick={handleDecrease}
              disabled={isAdding}
              className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#C12116] text-white transition-colors hover:bg-[#a01b12] disabled:opacity-50'
            >
              <Minus className='h-3.5 w-3.5' />
            </button>
            <span className='w-6 text-center font-[Nunito] text-[16px] font-bold text-[#0A0D12]'>
              {quantity}
            </span>
            <button
              onClick={handleIncrease}
              disabled={isAdding}
              className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#C12116] text-white transition-colors hover:bg-[#a01b12] disabled:opacity-50'
            >
              <Plus className='h-3.5 w-3.5' />
            </button>
          </div>
        ) : (
          <Button
            size='sm'
            onClick={handleAdd}
            disabled={isAdding}
            className='h-[40px] rounded-[100px] bg-[#C12116] px-6 py-2 font-[Nunito] text-[16px] font-bold tracking-[-0.02em] text-white hover:bg-[#a01b12]'
          >
            Add
          </Button>
        )}
      </div>
    </div>
  );
}
