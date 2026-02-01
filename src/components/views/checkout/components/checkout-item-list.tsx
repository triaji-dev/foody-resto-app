'use client';

import { Card, CardContent } from '@/components/ui/card';
import { CartGroupedItem } from '@/services/cart';
import { formatCurrency } from '@/lib/format';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, Store } from 'lucide-react'; // If we want to allow editing, otherwise simpler

interface CheckoutItemListProps {
  cartGroups: CartGroupedItem[];
}

export function CheckoutItemList({ cartGroups }: CheckoutItemListProps) {
  return (
    <div className='space-y-6'>
      {cartGroups.map((group) => (
        <Card
          key={group.restaurant.id}
          className='overflow-hidden border-neutral-200 shadow-sm'
        >
          <div className='flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-6 py-3'>
            <Store className='h-4 w-4 text-neutral-500' />
            <h4 className='font-bold text-neutral-900'>
              {group.restaurant.name}
            </h4>
          </div>
          <CardContent className='space-y-4 p-6'>
            {group.items.map((item) => (
              <div key={item.id} className='flex gap-4'>
                <div className='h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100'>
                  {item.menu.image ? (
                    <img
                      src={item.menu.image}
                      alt={item.menu.foodName}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='h-full w-full bg-neutral-200' />
                  )}
                </div>
                <div className='flex flex-1 flex-col justify-center'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h4 className='line-clamp-1 font-bold text-neutral-900'>
                        {item.menu.foodName}
                      </h4>
                      <p className='text-primary mt-1 text-sm font-bold'>
                        {formatCurrency(item.menu.price)}
                      </p>
                    </div>
                    <div className='flex items-center gap-3 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-1'>
                      <span className='text-sm font-bold text-neutral-700'>
                        {item.quantity}x
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
