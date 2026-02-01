'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isPending: boolean;
  formState: {
    address: string;
    setAddress: (val: string) => void;
    phone: string;
    setPhone: (val: string) => void;
    notes: string;
    setNotes: (val: string) => void;
    paymentMethod: string;
  };
}

export function CheckoutDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  formState,
}: CheckoutDialogProps) {
  const {
    address,
    setAddress,
    phone,
    setPhone,
    notes,
    setNotes,
    paymentMethod,
  } = formState;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Review your details and place your order.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='address'>Delivery Address</Label>
            <Textarea
              id='address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='Enter your full address...'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone Number</Label>
            <Input
              id='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='0812...'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='notes'>Notes (Optional)</Label>
            <Textarea
              id='notes'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Any special instructions...'
            />
          </div>
          <div className='space-y-2'>
            <Label>Payment Method</Label>
            <div className='rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm font-medium'>
              {paymentMethod === 'Cash'
                ? 'Cash on Delivery (Default)'
                : paymentMethod}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={onSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
