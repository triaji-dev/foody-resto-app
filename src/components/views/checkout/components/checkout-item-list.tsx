'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';
import { CartGroupedItem, CartItem } from '@/services/cart';
import { useCart } from '@/features/cart/useCart';
import { useCartInteractions } from '@/features/cart/useCartInteractions';

// Format price in IDR
function formatPrice(price: number): string {
  return `Rp${price.toLocaleString('id-ID')}`;
}

interface CheckoutItemListProps {
  cartGroups: CartGroupedItem[];
}

export function CheckoutItemList({ cartGroups }: CheckoutItemListProps) {
  const router = useRouter();
  const { updateItem, isUpdating, deleteItem, isDeleting } = useCart(true);

  const { handleUpdateQuantity } = useCartInteractions({
    updateItem,
    deleteItem,
  });

  const handleNavigateToRestaurant = (restaurantId: number) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  return (
    <div className='w-full rounded-2xl bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'>
      <div className='flex flex-col gap-4'>
        {cartGroups.map((group) => (
          <div key={group.restaurant.id} className='flex w-full flex-col gap-3'>
            {/* Restaurant Header */}
            <div className='flex h-10 w-full flex-row items-center justify-between'>
              <div className='flex flex-row items-center gap-2'>
                <div className='relative h-8 w-8 shrink-0'>
                  <Image
                    src={group.restaurant.logo || '/icons/resto-shop.png'}
                    alt={group.restaurant.name}
                    fill
                    sizes='32px'
                    className='rounded object-cover'
                  />
                </div>
                <h3 className='font-[Nunito] text-base leading-[30px] font-bold tracking-[-0.02em] text-gray-900'>
                  {group.restaurant.name}
                </h3>
              </div>

              {/* Add Item Button */}
              <button
                className='flex h-9 shrink-0 cursor-pointer flex-row items-center justify-center gap-2 rounded-full border border-[#D5D7DA] px-6 py-2 transition-colors hover:bg-gray-50'
                onClick={() => handleNavigateToRestaurant(group.restaurant.id)}
              >
                <span className='font-[Nunito] text-sm leading-7 font-bold tracking-[-0.02em] text-gray-900'>
                  Add item
                </span>
              </button>
            </div>

            {/* Cart Items */}
            <div className='flex w-full flex-col gap-3'>
              {group.items.map((item) => (
                <CheckoutItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  isUpdating={isUpdating}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Item Card Component
interface CheckoutItemCardProps {
  item: CartItem;
  onUpdateQuantity: (
    id: number,
    currentQuantity: number,
    change: number
  ) => void;
  isUpdating: boolean;
}

function CheckoutItemCard({
  item,
  onUpdateQuantity,
  isUpdating,
}: CheckoutItemCardProps) {
  const handleDecrease = () => onUpdateQuantity(item.id, item.quantity, -1);
  const handleIncrease = () => onUpdateQuantity(item.id, item.quantity, 1);

  return (
    <div className='flex h-[84px] w-full flex-row items-center gap-4'>
      {/* Food Image */}
      <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-xl'>
        <Image
          src={item.menu.image || '/images/menu-placeholder.jpg'}
          alt={item.menu.foodName}
          fill
          sizes='64px'
          className='object-cover'
        />
      </div>

      {/* Food Details */}
      <div className='flex min-w-0 flex-1 flex-col items-start'>
        <div className='w-full truncate font-[Nunito] text-sm leading-7 font-medium text-gray-900'>
          {item.menu.foodName}
        </div>
        <div className='font-[Nunito] text-base leading-[30px] font-extrabold text-gray-900'>
          {formatPrice(item.menu.price)}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className='flex shrink-0 flex-row items-center gap-3 md:gap-4'>
        {/* Minus Button */}
        <button
          onClick={handleDecrease}
          disabled={isUpdating}
          className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[#D5D7DA] transition-colors hover:bg-gray-50 disabled:opacity-50 md:h-9 md:w-9'
          type='button'
        >
          <Minus className='h-4 w-4 text-gray-900 md:h-5 md:w-5' />
        </button>

        {/* Quantity */}
        <span className='min-w-[16px] text-center font-[Nunito] text-sm leading-[30px] font-semibold tracking-[-0.02em] text-gray-900 md:min-w-[20px] md:text-base'>
          {item.quantity}
        </span>

        {/* Plus Button */}
        <button
          onClick={handleIncrease}
          disabled={isUpdating}
          className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#C12116] transition-colors hover:bg-[#B01E14] disabled:opacity-50 md:h-9 md:w-9'
          type='button'
        >
          <Plus className='h-4 w-4 text-white md:h-5 md:w-5' />
        </button>
      </div>
    </div>
  );
}
