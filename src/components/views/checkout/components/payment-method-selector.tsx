'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CreditCard } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onSelect: (method: string) => void;
}

const PAYMENT_METHODS = [
  { id: 'Bank Negara Indonesia', label: 'Bank Negara Indonesia', icon: 'BNI' },
  { id: 'Bank Rakyat Indonesia', label: 'Bank Rakyat Indonesia', icon: 'BRI' },
  { id: 'Bank Central Asia', label: 'Bank Central Asia', icon: 'BCA' },
  { id: 'Mandiri', label: 'Mandiri', icon: 'Mandiri' },
];

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <Card className='h-fit border-neutral-200 shadow-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg font-bold'>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-3'>
        {PAYMENT_METHODS.map((method) => (
          <div
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={cn(
              'flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all',
              selectedMethod === method.id
                ? 'border-primary ring-primary bg-red-50/50 ring-1'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            )}
          >
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-14 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-600'>
                {/* Placeholder for Bank Logo */}
                {method.icon}
              </div>
              <span className='font-medium text-neutral-900'>
                {method.label}
              </span>
            </div>

            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border',
                selectedMethod === method.id
                  ? 'border-primary bg-primary'
                  : 'border-neutral-300'
              )}
            >
              {selectedMethod === method.id && (
                <div className='h-2 w-2 rounded-full bg-white' />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
