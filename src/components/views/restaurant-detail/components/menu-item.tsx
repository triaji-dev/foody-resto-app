'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Menu } from '@/types/api';

interface MenuItemProps {
  menu: Menu;
  onAddToCart?: (quantity: number) => void;
}

// Format price in IDR
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function MenuItem({ menu, onAddToCart }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!onAddToCart) return;

    setIsAdding(true);
    try {
      await onAddToCart(quantity);
      setQuantity(1); // Reset quantity after adding
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className='group overflow-hidden transition-all hover:shadow-lg'>
      {/* Image section */}
      <div className='relative h-40 w-full overflow-hidden'>
        <Image
          src={menu.image || '/images/menu-placeholder.jpg'}
          alt={menu.name}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
        />
        {menu.isBestSeller && (
          <div className='text-xs-custom absolute top-2 left-2 rounded-full bg-orange-500 px-2 py-1 font-semibold text-white'>
            Best Seller
          </div>
        )}
      </div>

      <CardContent className='p-4'>
        {/* Name and category */}
        <div className='mb-2'>
          <h4 className='text-lg-custom line-clamp-1 font-bold'>{menu.name}</h4>
          {menu.category && (
            <span className='text-muted-foreground text-xs-custom capitalize'>
              {menu.category}
            </span>
          )}
        </div>

        {/* Description */}
        <p className='text-muted-foreground text-sm-custom mb-3 line-clamp-2'>
          {menu.description || 'No description available'}
        </p>

        {/* Price and actions */}
        <div className='flex items-center justify-between'>
          <span className='text-primary text-lg-custom font-bold'>
            {formatPrice(menu.price)}
          </span>

          {onAddToCart ? (
            <div className='flex items-center gap-2'>
              {/* Quantity controls */}
              <div className='flex items-center gap-1'>
                <Button
                  size='icon'
                  variant='outline'
                  className='h-7 w-7'
                  onClick={handleDecrease}
                  disabled={quantity <= 1 || isAdding}
                >
                  <Minus className='h-3 w-3' />
                </Button>
                <span className='text-sm-custom w-6 text-center font-medium'>
                  {quantity}
                </span>
                <Button
                  size='icon'
                  variant='outline'
                  className='h-7 w-7'
                  onClick={handleIncrease}
                  disabled={isAdding}
                >
                  <Plus className='h-3 w-3' />
                </Button>
              </div>

              {/* Add to cart button */}
              <Button
                size='sm'
                onClick={handleAddToCart}
                disabled={isAdding}
                className='gap-1'
              >
                <ShoppingCart className='h-4 w-4' />
                Add
              </Button>
            </div>
          ) : (
            <Button size='icon' variant='ghost' className='h-8 w-8'>
              <Plus className='h-4 w-4' />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
