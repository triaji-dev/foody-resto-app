'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/features/auth';
import { useCart } from '@/features/cart/useCart';
import { useCheckout } from '@/features/cart/useCheckout';
import { useCartInteractions } from '@/features/cart/useCartInteractions';
import { ROUTES } from '@/constants';
import {
  CartEmptyState,
  CartItem,
  CartSummary,
  CheckoutDialog,
  DeleteConfirmationDialog,
} from './components';

export default function CartPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
    }
  }, [isAuthenticated, router]);

  const {
    cartGroups,
    grandTotal,
    isLoading,
    updateItem,
    isUpdating,
    deleteItem,
    isDeleting,
    clearCart,
  } = useCart(isAuthenticated);

  const handleCheckout = () => {
    router.push('/checkout');
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
    <div className='min-h-screen bg-neutral-50 font-sans'>
      <main className='container mx-auto max-w-4xl px-4 py-8 pt-24'>
        <h1 className='display-md mb-8 font-extrabold tracking-tight'>
          Shopping Cart
        </h1>

        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='text-primary h-8 w-8 animate-spin' />
          </div>
        ) : cartGroups.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className='flex flex-col gap-8 lg:flex-row'>
            <div className='flex-1 space-y-6'>
              {cartGroups.map((group) => (
                <div
                  key={group.restaurant.id}
                  className='overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm'
                >
                  <div className='border-b border-neutral-100 bg-neutral-50 p-4'>
                    <h3 className='text-lg-custom font-bold'>
                      {group.restaurant.name}
                    </h3>
                  </div>
                  <div className='space-y-4 p-4'>
                    {group.items.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onDelete={confirmDelete}
                        isUpdating={isUpdating}
                        isDeleting={isDeleting}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className='w-full shrink-0 lg:w-80'>
              <CartSummary
                cartGroups={cartGroups}
                grandTotal={grandTotal}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}

        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleConfirmDelete}
        />
      </main>
    </div>
  );
}
