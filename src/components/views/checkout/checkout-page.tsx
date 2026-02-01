'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { useCart } from '@/features/cart/useCart';
import { useCheckout } from '@/features/cart/useCheckout';
import { ROUTES } from '@/constants';
import { Loader2 } from 'lucide-react';

import { DeliveryAddressCard } from './components/delivery-address-card';
import { PaymentMethodSelector } from './components/payment-method-selector';
import { CheckoutItemList } from './components/checkout-item-list';

// Format price in IDR
function formatPrice(price: number): string {
  return `Rp${price.toLocaleString('id-ID')}`;
}

// Validation errors type
interface ValidationErrors {
  address?: string;
  phone?: string;
}

export default function CheckoutPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

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

  // Derived values
  const deliveryFee = 10000;
  const serviceFee = 1000;
  const totalItems = cartGroups.reduce((acc, g) => acc + g.items.length, 0);
  const finalTotal = grandTotal + deliveryFee + serviceFee;

  const {
    formState,
    submitCheckout,
    isPending: isCheckoutPending,
    openCheckout: initCheckoutData,
  } = useCheckout({
    cartGroups,
    onCheckoutSuccess: async () => {
      // Save order data to localStorage for payment success page
      const orderData = {
        subtotal: grandTotal,
        deliveryFee,
        serviceFee,
        total: finalTotal,
        totalItems,
        paymentMethod: formState.paymentMethod,
        orderDate: new Date().toISOString(),
      };
      localStorage.setItem('lastOrderData', JSON.stringify(orderData));

      // Clear cart
      try {
        await clearCart();
      } catch (e) {
        console.error('Failed to clear cart:', e);
      }

      // Navigate to payment success page
      router.push('/payment-success');
    },
  });

  // Validate form before checkout
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formState.address || formState.address.trim() === '') {
      errors.address = 'Delivery address is required';
    } else if (formState.address.trim().length < 10) {
      errors.address = 'Please enter a complete address (min 10 characters)';
    }

    if (!formState.phone || formState.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    } else if (formState.phone.trim().length < 8) {
      errors.phone = 'Please enter a valid phone number (min 8 characters)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle checkout with validation
  const handleCheckout = () => {
    const isValid = validateForm();
    if (isValid) {
      submitCheckout();
    }
  };

  // Clear errors when form values change
  useEffect(() => {
    if (formState.address && validationErrors.address) {
      setValidationErrors((prev) => ({ ...prev, address: undefined }));
    }
  }, [formState.address, validationErrors.address]);

  useEffect(() => {
    if (formState.phone && validationErrors.phone) {
      setValidationErrors((prev) => ({ ...prev, phone: undefined }));
    }
  }, [formState.phone, validationErrors.phone]);

  // Initialize checkout data once
  useEffect(() => {
    if (isAuthenticated && !isCartLoading) {
      initCheckoutData();
    }
  }, [isAuthenticated, isCartLoading]);

  if (!isAuthenticated || isCartLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <Loader2 className='h-8 w-8 animate-spin text-[#C12116]' />
      </div>
    );
  }

  // Empty cart state
  if (cartGroups.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 pt-20'>
        <div className='mx-auto max-w-6xl px-8 py-16'>
          <div className='text-center'>
            <h1 className='mb-8 text-4xl font-extrabold text-gray-900'>
              Checkout
            </h1>
            <div className='rounded-2xl bg-white p-16 shadow-lg'>
              <div className='mb-4 text-lg text-gray-500'>
                Your cart is empty
              </div>
              <button
                onClick={() => router.push('/')}
                className='cursor-pointer rounded-full bg-[#C12116] px-8 py-3 font-bold text-white transition-colors hover:bg-[#B01E14]'
              >
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 pt-20'>
      <div className='mx-auto max-w-250 px-4 py-4 md:px-8 md:py-16'>
        {/* Page Title */}
        <h1 className='mb-4 font-[Nunito] text-2xl font-extrabold text-gray-900 md:mb-8 md:text-4xl'>
          Checkout
        </h1>

        {/* Main Content */}
        <div className='flex flex-col gap-4 md:flex-row md:gap-5'>
          {/* Left Column - Order Details */}
          <div className='flex-1 space-y-4 md:space-y-5'>
            <DeliveryAddressCard
              address={formState.address}
              phone={formState.phone}
              onAddressChange={formState.setAddress}
              onPhoneChange={formState.setPhone}
              errors={validationErrors}
            />

            <CheckoutItemList cartGroups={cartGroups} />
          </div>

          {/* Right Column - Payment & Summary */}
          <div className='w-full md:w-96'>
            <div className='relative w-full rounded-2xl bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'>
              {/* Decorative Ellipses */}
              <div
                className='absolute -left-2.5 h-5 w-5 rounded-full bg-gray-100'
                style={{ top: '51%', zIndex: 3 }}
              />
              <div
                className='absolute -right-2.5 h-5 w-5 rounded-full bg-gray-100'
                style={{ top: '51%', zIndex: 3 }}
              />

              <div className='flex w-full flex-col items-end gap-4 py-4'>
                {/* Payment Method Section */}
                <div className='w-full px-4'>
                  <PaymentMethodSelector
                    selectedMethod={formState.paymentMethod}
                    onSelect={formState.setPaymentMethod}
                  />
                </div>

                {/* Dashed Line Separator */}
                <div className='h-px w-full border-t border-dashed border-[#D5D7DA]' />

                {/* Payment Summary Section */}
                <div className='flex w-full flex-col items-start gap-3 px-4'>
                  <h3 className='w-full font-[Nunito] text-base leading-[30px] font-extrabold text-gray-900'>
                    Payment Summary
                  </h3>

                  <div className='w-full space-y-3'>
                    <div className='flex h-7 w-full items-center justify-between'>
                      <span className='font-[Nunito] text-sm leading-7 font-medium text-gray-900'>
                        Price ({totalItems} items)
                      </span>
                      <span className='font-[Nunito] text-sm leading-7 font-bold tracking-[-0.02em] text-gray-900'>
                        {formatPrice(grandTotal)}
                      </span>
                    </div>

                    <div className='flex h-7 w-full items-center justify-between'>
                      <span className='font-[Nunito] text-sm leading-7 font-medium text-gray-900'>
                        Delivery Fee
                      </span>
                      <span className='font-[Nunito] text-sm leading-7 font-bold tracking-[-0.02em] text-gray-900'>
                        {formatPrice(deliveryFee)}
                      </span>
                    </div>

                    <div className='flex h-7 w-full items-center justify-between'>
                      <span className='font-[Nunito] text-sm leading-7 font-medium text-gray-900'>
                        Service Fee
                      </span>
                      <span className='font-[Nunito] text-sm leading-7 font-bold tracking-[-0.02em] text-gray-900'>
                        {formatPrice(serviceFee)}
                      </span>
                    </div>

                    <div className='flex h-8 w-full items-center justify-between'>
                      <span className='font-[Nunito] text-base leading-[30px] font-normal tracking-[-0.02em] text-gray-900'>
                        Total
                      </span>
                      <span className='font-[Nunito] text-base leading-[30px] font-extrabold text-gray-900'>
                        {formatPrice(finalTotal)}
                      </span>
                    </div>

                    {/* Buy Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckoutPending || cartGroups.length === 0}
                      className='flex h-11 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full bg-[#C12116] px-2 py-2 transition-colors hover:bg-[#B01E14] disabled:cursor-not-allowed disabled:opacity-50'
                    >
                      {isCheckoutPending ? (
                        <>
                          <Loader2 className='h-4 w-4 animate-spin text-white' />
                          <span className='font-[Nunito] text-base leading-[30px] font-bold tracking-[-0.02em] text-[#FDFDFD]'>
                            Processing...
                          </span>
                        </>
                      ) : (
                        <span className='font-[Nunito] text-base leading-[30px] font-bold tracking-[-0.02em] text-[#FDFDFD]'>
                          Buy
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
