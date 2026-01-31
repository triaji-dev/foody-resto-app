'use client';

import Image from 'next/image';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/features/cart/useCart';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/use-auth';
import { ROUTES } from '@/constants';

// Format price in IDR
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function CartSheet() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const {
    items,
    isOpen,
    total,
    itemCount,
    isLoading,
    isUpdating,
    updateQuantity,
    removeItem,
    clearCart,
    closeSheet,
  } = useCart();

  const handleCheckout = () => {
    closeSheet();
    router.push('/checkout');
  };

  const handleLogin = () => {
    closeSheet();
    router.push(ROUTES.AUTH);
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeSheet}>
      <SheetContent className='flex w-full flex-col sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <ShoppingCart className='h-5 w-5' />
            Your Cart
            {itemCount > 0 && (
              <span className='bg-primary text-primary-foreground text-xs-custom rounded-full px-2 py-0.5'>
                {itemCount}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {!isAuthenticated ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <p className='text-muted-foreground text-center'>
              Please login to view your cart
            </p>
            <Button onClick={handleLogin}>Login</Button>
          </div>
        ) : isLoading ? (
          <div className='flex flex-1 items-center justify-center'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
          </div>
        ) : items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4'>
            <ShoppingCart className='text-muted-foreground h-16 w-16' />
            <p className='text-muted-foreground'>Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Clear cart button */}
            <div className='flex justify-end'>
              <Button
                variant='ghost'
                size='sm'
                onClick={clearCart}
                disabled={isUpdating}
                className='text-destructive hover:text-destructive'
              >
                <Trash2 className='mr-1 h-4 w-4' />
                Clear All
              </Button>
            </div>

            {/* Cart items */}
            <div className='flex-1 space-y-4 overflow-y-auto py-4'>
              {items.map((item) => (
                <div
                  key={item.id}
                  className='flex items-start gap-3 rounded-lg border p-3'
                >
                  {/* Image */}
                  <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-md'>
                    <Image
                      src={item.imageUrl || '/images/menu-placeholder.jpg'}
                      alt={item.name}
                      fill
                      className='object-cover'
                    />
                  </div>

                  {/* Details */}
                  <div className='flex-1'>
                    <h4 className='line-clamp-1 font-semibold'>{item.name}</h4>
                    <p className='text-primary text-sm-custom font-medium'>
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className='mt-2 flex items-center gap-2'>
                      <Button
                        size='icon'
                        variant='outline'
                        className='h-7 w-7'
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        <Minus className='h-3 w-3' />
                      </Button>
                      <span className='text-sm-custom w-8 text-center font-medium'>
                        {item.quantity}
                      </span>
                      <Button
                        size='icon'
                        variant='outline'
                        className='h-7 w-7'
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={isUpdating}
                      >
                        <Plus className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>

                  {/* Subtotal and remove */}
                  <div className='flex flex-col items-end gap-2'>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-6 w-6'
                      onClick={() => removeItem(item.id)}
                      disabled={isUpdating}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                    <span className='text-sm-custom font-semibold'>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className='space-y-4 border-t pt-4'>
              <Separator />
              <div className='text-lg-custom flex items-center justify-between font-bold'>
                <span>Total</span>
                <span className='text-primary'>{formatPrice(total)}</span>
              </div>
              <Button
                className='w-full'
                size='lg'
                onClick={handleCheckout}
                disabled={isUpdating || items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
