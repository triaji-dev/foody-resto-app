'use client';

import React, { useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import Image from 'next/image';

// Types
interface OrderData {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  totalItems: number;
  paymentMethod: string;
  orderDate: string;
}

// Utility Functions
function formatPrice(price: number): string {
  return `Rp${price.toLocaleString('id-ID')}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Sub-components
function LoadingState() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4'>
      <div className='text-center'>
        <div className='mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-gray-200' />
        <p className='text-gray-600'>Loading order details...</p>
      </div>
    </div>
  );
}

interface HeaderProps {
  onLogoClick: () => void;
}

function Header({ onLogoClick }: HeaderProps) {
  return (
    <div
      className='mb-4 flex cursor-pointer items-center gap-4 transition-opacity hover:opacity-80 md:mb-7'
      onClick={onLogoClick}
    >
      <div className='relative h-10 w-28 md:h-12 md:w-12'>
        <Image
          src='/icons/logo-foody.svg'
          alt='Foody Logo'
          fill
          sizes='(max-width: 768px) 42px, 42px'
          className='object-contain'
        />
      </div>
      <h1 className='display-md font-extrabold text-gray-900'>Foody</h1>
    </div>
  );
}

interface PaymentDetailRowProps {
  label: string;
  value: string;
}

function PaymentDetailRow({ label, value }: PaymentDetailRowProps) {
  return (
    <div className='flex h-6 w-full items-center justify-between py-1 md:h-[30px] md:py-2'>
      <span className='font-[Nunito] text-xs leading-6 font-medium tracking-[-0.03em] text-gray-900 md:text-base md:leading-[30px]'>
        {label}
      </span>
      <span className='font-[Nunito] text-xs leading-6 font-bold tracking-[-0.02em] text-gray-900 md:text-base md:leading-[30px]'>
        {value}
      </span>
    </div>
  );
}

// Main Component
export default function PaymentSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get order data from localStorage
  useLayoutEffect(() => {
    const fetchOrderData = async () => {
      try {
        const storedData = localStorage.getItem('lastOrderData');
        if (storedData) {
          const parsedData = JSON.parse(storedData) as OrderData;
          setOrderData(parsedData);
        }
      } catch (error) {
        console.error('Error loading order data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  // Event handlers
  const handleSeeOrders = () => {
    localStorage.removeItem('lastOrderData');
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    router.push('/profile/orders');
  };

  const handleLogoClick = () => {
    localStorage.removeItem('lastOrderData');
    router.push('/');
  };

  // Cleanup on unmount
  useLayoutEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('lastOrderData');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 md:px-8'>
      <Header onLogoClick={handleLogoClick} />

      <div className='flex flex-col items-center'>
        {/* Success Card */}
        <div className='relative flex w-[320px] flex-col items-center overflow-hidden rounded-2xl bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)] md:w-[428px] md:p-5'>
          {/* Success Icon */}
          <div className='mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#44AB09] md:h-16 md:w-16'>
            <Check
              className='h-6 w-6 text-white md:h-8 md:w-8'
              style={{ strokeWidth: '3' }}
            />
          </div>

          {/* Title */}
          <h2 className='font-[Nunito] text-base leading-6 font-extrabold text-gray-900 md:text-xl md:leading-[34px]'>
            Payment Success
          </h2>

          {/* Subtitle */}
          <p className='font-[Nunito] text-xs leading-5 font-normal tracking-[-0.02em] text-gray-900 md:text-base md:leading-[30px]'>
            Your payment has been successfully processed.
          </p>

          {/* First Dashed Separator with Ellipses */}
          <div className='relative my-3 flex w-full items-center md:my-4'>
            {/* Left Ellipse */}
            <div className='absolute -left-6 h-5 w-5 rounded-full bg-gray-100 md:-left-7 md:h-6 md:w-6' />
            {/* Dashed Line */}
            <div className='w-full border-t border-dashed border-[#D5D7DA]' />
            {/* Right Ellipse */}
            <div className='absolute -right-6 h-5 w-5 rounded-full bg-gray-100 md:-right-7 md:h-6 md:w-6' />
          </div>

          {/* Payment Details */}
          <div className='flex w-full flex-col gap-1 md:gap-2'>
            <PaymentDetailRow
              label='Date'
              value={
                orderData
                  ? formatDate(orderData.orderDate)
                  : formatDate(new Date().toISOString())
              }
            />
            <PaymentDetailRow
              label='Payment Method'
              value={orderData?.paymentMethod || 'Bank Negara Indonesia'}
            />
            <PaymentDetailRow
              label={`Price (${orderData?.totalItems || 0} items)`}
              value={formatPrice(orderData?.subtotal || 0)}
            />
            <PaymentDetailRow
              label='Delivery Fee'
              value={formatPrice(orderData?.deliveryFee || 10000)}
            />
            <PaymentDetailRow
              label='Service Fee'
              value={formatPrice(orderData?.serviceFee || 1000)}
            />
          </div>

          {/* Second Dashed Separator with Ellipses */}
          <div className='relative my-3 flex w-full items-center md:my-4'>
            {/* Left Ellipse */}
            <div className='absolute -left-6 h-5 w-5 rounded-full bg-gray-100 md:-left-7 md:h-6 md:w-6' />
            {/* Dashed Line */}
            <div className='w-full border-t border-dashed border-[#D5D7DA]' />
            {/* Right Ellipse */}
            <div className='absolute -right-6 h-5 w-5 rounded-full bg-gray-100 md:-right-7 md:h-6 md:w-6' />
          </div>

          {/* Total */}
          <div className='mb-4 flex w-full items-center justify-between'>
            <span className='font-[Nunito] text-sm leading-7 font-normal text-gray-900 md:text-lg md:leading-8'>
              Total
            </span>
            <span className='font-[Nunito] text-sm leading-7 font-extrabold tracking-[-0.02em] text-gray-900 md:text-lg md:leading-8'>
              {formatPrice(orderData?.total || 0)}
            </span>
          </div>

          {/* See My Orders Button */}
          <button
            onClick={handleSeeOrders}
            className='flex h-10 w-full cursor-pointer items-center justify-center rounded-full bg-[#C12116] px-2 py-2 transition-opacity hover:opacity-90 md:h-12'
          >
            <span className='font-[Nunito] text-xs leading-6 font-bold tracking-[-0.02em] text-[#FDFDFD] md:text-base md:leading-[30px]'>
              See My Orders
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
