'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface DeliveryAddressCardProps {
  address: string;
  phone: string;
  onAddressChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  errors?: {
    address?: string;
    phone?: string;
  };
  isEditing?: boolean;
}

export function DeliveryAddressCard({
  address,
  phone,
  onAddressChange,
  onPhoneChange,
  errors,
}: DeliveryAddressCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Show error if there's an error message
  const hasAddressError = Boolean(errors?.address);
  const hasPhoneError = Boolean(errors?.phone);

  // Auto-open editing mode when there are errors
  useEffect(() => {
    if (hasAddressError || hasPhoneError) {
      setIsEditing(true);
    }
  }, [hasAddressError, hasPhoneError]);

  return (
    <div className='w-full rounded-2xl bg-white p-4 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]'>
      <div className='flex w-full flex-col gap-3'>
        <div className='flex w-full flex-col items-start gap-1'>
          {/* Header */}
          <div className='flex flex-row items-center gap-2'>
            <div className='relative h-6 w-6 shrink-0'>
              <Image
                src='/icons/delivery-address.png'
                alt='Location'
                fill
                sizes='24px'
                className='object-contain'
              />
            </div>
            <h3 className='font-[Nunito] text-base leading-[30px] font-extrabold text-gray-900'>
              Delivery Address
            </h3>
          </div>

          {/* Address Content */}
          <div className='w-full'>
            {isEditing ? (
              <div className='space-y-3'>
                {/* Address Input */}
                <div>
                  <label className='mb-1 block font-[Nunito] text-xs text-gray-500'>
                    Address
                  </label>
                  <input
                    type='text'
                    value={address}
                    onChange={(e) => onAddressChange(e.target.value)}
                    placeholder='Ex: Jl. Sudirman No. 123, Jakarta Pusat, 10220'
                    className={`w-full rounded-lg border px-3 py-2 font-[Nunito] text-sm focus:outline-none ${
                      hasAddressError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#D5D7DA] focus:border-[#C12116]'
                    }`}
                  />
                  {hasAddressError && (
                    <p className='mt-1 font-[Nunito] text-xs text-red-500'>
                      {errors?.address}
                    </p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className='mb-1 block font-[Nunito] text-xs text-gray-500'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    placeholder='Ex: 0812-3456-7890'
                    className={`w-full rounded-lg border px-3 py-2 font-[Nunito] text-sm focus:outline-none ${
                      hasPhoneError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#D5D7DA] focus:border-[#C12116]'
                    }`}
                  />
                  {hasPhoneError && (
                    <p className='mt-1 font-[Nunito] text-xs text-red-500'>
                      {errors?.phone}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className='space-y-1'>
                <p className='font-[Nunito] text-sm leading-7 font-medium text-gray-900'>
                  {address || 'No address provided'}
                </p>
                <p className='font-[Nunito] text-sm leading-7 font-medium text-gray-900'>
                  {phone || 'No phone number provided'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Change Button */}
        <button
          className='flex h-9 w-[120px] cursor-pointer flex-row items-center justify-center gap-2 self-start rounded-full border border-[#D5D7DA] px-2 py-2 transition-colors hover:bg-gray-50'
          onClick={() => setIsEditing(!isEditing)}
        >
          <span className='font-[Nunito] text-sm leading-7 font-bold tracking-[-0.02em] text-gray-900'>
            {isEditing ? 'Save' : 'Change'}
          </span>
        </button>
      </div>
    </div>
  );
}
