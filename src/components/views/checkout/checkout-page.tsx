'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { useCart } from '@/features/cart/useCart';
import { useCheckout } from '@/features/cart/useCheckout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format';
import { ROUTES } from '@/constants';
import { Loader2 } from 'lucide-react';

import { DeliveryAddressCard } from './components/delivery-address-card';
import { PaymentMethodSelector } from './components/payment-method-selector';
import { CheckoutItemList } from './components/checkout-item-list';
import { SuccessModal } from './components/success-modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(ROUTES.AUTH);
    }
  }, [isAuthenticated, router]);

  const {
    cartGroups,
    grandTotal,
    isLoading: isCartLoading,
    clearCart,
  } = useCart(isAuthenticated);

  const {
    formState,
    submitCheckout,
    isPending: isCheckoutPending,
    openCheckout: initCheckoutData,
  } = useCheckout({
    cartGroups,
    onCheckoutSuccess: async () => {
      setSuccessOpen(true);
      // We delay clearCart slightly or handle it in success modal close if preferred,
      // but typically we clear it now so back button doesn't show cart.
      try {
        await clearCart();
      } catch (e) {
        console.error(e);
      }
    },
  });

  // Initialize checkout data (address/phone from user/orders) once
  useEffect(() => {
    if (isAuthenticated && !isCartLoading) {
      initCheckoutData();
    }
  }, [isAuthenticated, isCartLoading]);

  if (!isAuthenticated || isCartLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-neutral-50'>
        <Loader2 className='text-primary h-8 w-8 animate-spin' />
      </div>
    );
  }

  // Derived values
  const deliveryFee = 10000;
  const serviceFee = 1000;
  const finalTotal = grandTotal + deliveryFee + serviceFee;

  return (
    <div className='min-h-screen bg-neutral-50 pt-24 pb-20 font-sans'>
      <main className='container mx-auto max-w-6xl px-4'>
        <h1 className='text-display-xs md:text-display-sm mb-8 font-extrabold text-neutral-900'>
          Checkout
        </h1>

        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Left Column: Details & Items */}
          <div className='flex-1 space-y-6'>
            <DeliveryAddressCard
              address={formState.address}
              phone={formState.phone}
              onAddressChange={formState.setAddress}
              onPhoneChange={formState.setPhone}
            />

            <CheckoutItemList cartGroups={cartGroups} />
          </div>

          {/* Right Column: Payment & Summary */}
          <div className='w-full shrink-0 space-y-6 lg:w-96'>
            <PaymentMethodSelector
              selectedMethod={formState.paymentMethod}
              onSelect={formState.setPaymentMethod}
            />

            <Card className='border-neutral-200 shadow-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg font-bold'>
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between text-sm text-neutral-600'>
                  <span>
                    Price (
                    {cartGroups.reduce((acc, g) => acc + g.items.length, 0)}{' '}
                    items)
                  </span>
                  <span className='font-medium text-neutral-900'>
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
                <div className='flex justify-between text-sm text-neutral-600'>
                  <span>Delivery Fee</span>
                  <span className='font-medium text-neutral-900'>
                    {formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className='flex justify-between text-sm text-neutral-600'>
                  <span>Service Fee</span>
                  <span className='font-medium text-neutral-900'>
                    {formatCurrency(serviceFee)}
                  </span>
                </div>

                <Separator className='my-2' />

                <div className='flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span className='text-primary'>
                    {formatCurrency(finalTotal)}
                  </span>
                </div>

                <Button
                  className='text-md mt-4 h-12 w-full font-bold text-white'
                  size='lg'
                  disabled={isCheckoutPending || cartGroups.length === 0}
                  onClick={submitCheckout}
                >
                  {isCheckoutPending ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Processing...
                    </>
                  ) : (
                    'Buy'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        paymentMethod={formState.paymentMethod}
        totalItems={cartGroups.reduce((acc, g) => acc + g.items.length, 0)}
        subtotal={grandTotal}
        deliveryFee={deliveryFee}
        serviceFee={serviceFee}
        grandTotal={finalTotal}
      />
    </div>
  );
}
