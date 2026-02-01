'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeliveryAddressCardProps {
  address: string;
  phone: string;
  onAddressChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  isEditing?: boolean;
}

export function DeliveryAddressCard({
  address,
  phone,
  onAddressChange,
  onPhoneChange,
}: DeliveryAddressCardProps) {
  return (
    <Card className='overflow-hidden border-neutral-200 shadow-sm'>
      <CardContent className='p-6'>
        <div className='flex items-start gap-4'>
          <div className='mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50'>
            <MapPin className='text-primary h-5 w-5' />
          </div>
          <div className='flex-1 space-y-4'>
            <div>
              <h3 className='text-md font-bold text-neutral-900'>
                Delivery Address
              </h3>
            </div>

            <div className='space-y-3'>
              <div className='space-y-1.5'>
                <Label htmlFor='address' className='text-xs text-neutral-500'>
                  Address
                </Label>
                <Input
                  id='address'
                  value={address}
                  onChange={(e) => onAddressChange(e.target.value)}
                  placeholder='Ex: Jl. Sudirman No. 123...'
                  className='border-neutral-200 bg-neutral-50'
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='phone' className='text-xs text-neutral-500'>
                  Phone Number
                </Label>
                <Input
                  id='phone'
                  value={phone}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  placeholder='Ex: 081234567890'
                  className='border-neutral-200 bg-neutral-50'
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
