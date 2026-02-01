'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

const PAYMENT_METHODS = [
  {
    id: 'Bank Negara Indonesia',
    label: 'Bank Negara Indonesia',
    logo: '/icons/BNI.png',
  },
  {
    id: 'Bank Rakyat Indonesia',
    label: 'Bank Rakyat Indonesia',
    logo: '/icons/BRI.png',
  },
  {
    id: 'Bank Central Asia',
    label: 'Bank Central Asia',
    logo: '/icons/BCA.png',
  },
  { id: 'Mandiri', label: 'Mandiri', logo: '/icons/Mandiri.png' },
];

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className='flex w-full flex-col items-start'>
      <h3 className='mb-4 w-full font-[Nunito] text-base leading-[30px] font-extrabold text-gray-900'>
        Payment Method
      </h3>

      <div className='flex w-full flex-col'>
        {PAYMENT_METHODS.map((method, index) => (
          <div key={method.id}>
            <div
              className='flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50'
              onClick={() => onSelect(method.id)}
            >
              {/* Bank Logo */}
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D5D7DA] p-1'>
                <Image
                  src={method.logo}
                  alt={method.label}
                  width={40}
                  height={40}
                  className='object-contain'
                />
              </div>

              {/* Bank Name */}
              <span className='flex-1 font-[Nunito] text-sm leading-7 font-normal tracking-[-0.02em] text-gray-900'>
                {method.label}
              </span>

              {/* Radio Button */}
              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  selectedMethod === method.id
                    ? 'bg-[#C12116]'
                    : 'border-2 border-[#A4A7AE]'
                )}
              >
                {selectedMethod === method.id && (
                  <div className='h-2 w-2 rounded-full bg-white' />
                )}
              </div>
            </div>

            {/* Separator between items */}
            {index < PAYMENT_METHODS.length - 1 && (
              <div className='my-3 h-px w-full bg-[#E9EAEB]' />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
