'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2, ChevronRight } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { useCart } from '@/features/cart/useCart';
import { useCartInteractions } from '@/features/cart/useCartInteractions';
import { ROUTES } from '@/constants';
import {
  CartItem,
  DeleteConfirmationDialog,
  CartEmptyState,
} from './components';
import type { CartGroupedItem } from '@/services/cart';

// Format price in IDR
function formatPrice(price: number): string {
  return `Rp${price.toLocaleString('id-ID')}`;
}

// Restaurant Group Component
interface RestaurantGroupProps {
  group: CartGroupedItem;
  onNavigateToRestaurant: (restaurantId: number) => void;
  onUpdateQuantity: (
    id: number,
    currentQuantity: number,
    change: number
  ) => void;
  onDelete: (id: number) => void;
  onCheckout: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isMobile?: boolean;
}

function RestaurantGroup({
  group,
  onNavigateToRestaurant,
  onUpdateQuantity,
  onDelete,
  onCheckout,
  isUpdating,
  isDeleting,
  isMobile = false,
}: RestaurantGroupProps) {
  if (isMobile) {
    return (
      <div className='flex w-full flex-col items-start gap-3 rounded-2xl bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'>
        {/* Restaurant Header */}
        <div
          className='flex h-8 w-full cursor-pointer flex-row items-center gap-2'
          onClick={() => onNavigateToRestaurant(group.restaurant.id)}
        >
          <div className='relative h-8 w-8 shrink-0'>
            <Image
              src={
                group.restaurant.logo || '/images/restaurant-placeholder.jpg'
              }
              alt={group.restaurant.name}
              fill
              sizes='32px'
              className='rounded object-cover'
            />
          </div>
          <div className='flex flex-1 flex-row items-center gap-1'>
            <span className='font-[Nunito] text-base leading-[30px] font-bold tracking-[-0.02em] text-gray-900'>
              {group.restaurant.name}
            </span>
            <ChevronRight className='h-5 w-5 text-gray-900' />
          </div>
        </div>

        {/* Cart Items */}
        <div className='flex w-full flex-col items-start gap-3'>
          {group.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onDelete={onDelete}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              isMobile={true}
            />
          ))}

          {/* Divider */}
          <div className='h-0 w-full border-t border-dashed border-[#D5D7DA]' />

          {/* Total and Checkout */}
          <div className='flex w-full flex-col items-start gap-3'>
            <div className='flex w-full flex-col items-start'>
              <div className='mb-1 font-[Nunito] text-sm leading-7 font-medium text-gray-900'>
                Total
              </div>
              <div className='font-[Nunito] text-lg leading-8 font-extrabold tracking-[-0.02em] text-gray-900'>
                {formatPrice(group.subtotal)}
              </div>
            </div>

            <button
              onClick={onCheckout}
              className='flex h-11 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full bg-[#C12116] p-2 transition-colors hover:bg-[#B01E14]'
            >
              <span className='font-[Nunito] text-sm leading-7 font-bold tracking-[-0.02em] text-[#FDFDFD]'>
                Checkout
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className='rounded-2xl bg-white p-5 shadow-lg'>
      {/* Restaurant Header */}
      <div
        className='mb-5 flex cursor-pointer flex-row items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-50'
        onClick={() => onNavigateToRestaurant(group.restaurant.id)}
      >
        <div className='relative h-8 w-8 shrink-0'>
          <Image
            src={group.restaurant.logo || '/images/restaurant-placeholder.jpg'}
            alt={group.restaurant.name}
            fill
            sizes='32px'
            className='rounded object-cover'
          />
        </div>
        <div className='flex flex-1 flex-row items-center gap-1'>
          <span className='font-[Nunito] text-base leading-[30px] font-bold tracking-[-0.02em] text-gray-900'>
            {group.restaurant.name}
          </span>
          <ChevronRight className='h-6 w-6 text-gray-400' />
        </div>
      </div>

      {/* Cart Items */}
      <div className='space-y-5'>
        {group.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onDelete={onDelete}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            isMobile={false}
          />
        ))}
      </div>

      {/* Divider */}
      <div className='my-5 border-t border-dashed border-gray-300' />

      {/* Total and Checkout */}
      <div className='flex items-center justify-between'>
        <div>
          <p className='mb-1 text-base font-medium text-gray-900'>Total</p>
          <p className='text-xl font-extrabold text-gray-900'>
            {formatPrice(group.subtotal)}
          </p>
        </div>
        <button
          onClick={onCheckout}
          className='w-60 cursor-pointer rounded-full bg-[#C12116] px-6 py-3 font-bold text-white transition-colors hover:bg-[#B01E14]'
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
    }
  }, [isAuthenticated, router]);

  const {
    cartGroups,
    isLoading,
    updateItem,
    isUpdating,
    deleteItem,
    isDeleting,
  } = useCart(isAuthenticated);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleNavigateToRestaurant = (restaurantId: number) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    confirmDelete,
    handleUpdateQuantity,
    handleConfirmDelete,
  } = useCartInteractions({
    updateItem,
    deleteItem,
  });

  if (!isAuthenticated) return null;

  return (
    <div className='min-h-screen bg-gray-50 pt-20'>
      <div className='mx-auto max-w-4xl px-4 py-4 md:px-8 md:py-16'>
        {/* Mobile Layout */}
        <div className='flex w-full flex-col items-start gap-4 md:hidden'>
          <h1 className='w-full font-[Nunito] text-2xl leading-9 font-extrabold text-gray-900'>
            My Cart
          </h1>

          {isLoading ? (
            <div className='flex w-full items-center justify-center py-16'>
              <Loader2 className='h-8 w-8 animate-spin text-[#C12116]' />
            </div>
          ) : cartGroups.length === 0 ? (
            <CartEmptyState />
          ) : (
            <div className='flex w-full flex-col items-start gap-5'>
              {cartGroups.map((group) => (
                <RestaurantGroup
                  key={group.restaurant.id}
                  group={group}
                  onNavigateToRestaurant={handleNavigateToRestaurant}
                  onUpdateQuantity={handleUpdateQuantity}
                  onDelete={confirmDelete}
                  onCheckout={handleCheckout}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                  isMobile={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className='hidden md:block'>
          <h1 className='mb-8 text-4xl font-extrabold text-gray-900'>
            My Cart
          </h1>

          {isLoading ? (
            <div className='flex items-center justify-center py-16'>
              <Loader2 className='h-12 w-12 animate-spin text-[#C12116]' />
            </div>
          ) : cartGroups.length === 0 ? (
            <CartEmptyState />
          ) : (
            <div className='space-y-6'>
              {cartGroups.map((group) => (
                <RestaurantGroup
                  key={group.restaurant.id}
                  group={group}
                  onNavigateToRestaurant={handleNavigateToRestaurant}
                  onUpdateQuantity={handleUpdateQuantity}
                  onDelete={confirmDelete}
                  onCheckout={handleCheckout}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                  isMobile={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
