'use client';

import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ROUTES } from '@/constants/routes';
import { formatCurrency } from '@/lib/format';

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentMethod: string;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  grandTotal: number;
}

export function SuccessModal({
  open,
  onOpenChange,
  paymentMethod,
  totalItems,
  subtotal,
  deliveryFee,
  serviceFee,
  grandTotal,
}: SuccessModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onOpenChange(false);
    router.push(ROUTES.ORDERS);
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='max-w-md overflow-hidden rounded-3xl bg-neutral-100 p-0'>
        <div className='relative flex flex-col items-center bg-white p-6 pt-8 text-center'>
          {/* Logo */}
          <div className='mb-6 flex items-center gap-2'>
            <Image
              src='/icons/logo-foody.svg'
              alt='Foody Logo'
              width={32}
              height={32}
              className='h-8 w-8'
            />
            <span className='text-2xl font-extrabold text-neutral-900'>
              Foody
            </span>
          </div>

          <div className='mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-200'>
            <CheckCircle2 className='h-10 w-10' />
          </div>

          <h2 className='text-xl font-bold text-neutral-900'>
            Payment Success
          </h2>
          <p className='mt-2 text-sm text-neutral-500'>
            Your payment has been successfully processed.
          </p>
        </div>

        {/* Receipt Section */}
        <div className='relative bg-neutral-50 px-6 pt-6 pb-8'>
          {/* Jagged / Dashed separator visual trick (simplified with border for now) */}
          <div className='absolute top-0 right-0 left-0 -mt-3 hidden h-6 bg-[url("/images/receipt-jagged.png")] bg-repeat-x md:block'></div>

          {/* Dashed line top */}
          <div className='absolute top-0 right-6 left-6 border-t-2 border-dashed border-neutral-200'></div>

          <div className='space-y-4'>
            <div className='flex justify-between text-sm'>
              <span className='text-neutral-500'>Date</span>
              <span className='font-medium text-neutral-900'>
                {currentDate}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-neutral-500'>Payment Method</span>
              <span className='truncate pl-4 font-medium text-neutral-900'>
                {paymentMethod}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-neutral-500'>
                Price ({totalItems} items)
              </span>
              <span className='font-medium text-neutral-900'>
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-neutral-500'>Delivery Fee</span>
              <span className='font-medium text-neutral-900'>
                {formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className='flex justify-between text-sm'>
              <span className='text-neutral-500'>Service Fee</span>
              <span className='font-medium text-neutral-900'>
                {formatCurrency(serviceFee)}
              </span>
            </div>

            <div className='my-4 border-t-2 border-dashed border-neutral-200'></div>

            <div className='flex justify-between text-lg font-bold'>
              <span>Total</span>
              <span className='text-neutral-900'>
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <Button
            onClick={handleClose}
            className='mt-8 w-full rounded-full bg-[#c12116] text-white hover:bg-[#a11b12]'
            size='lg'
          >
            See My Orders
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
