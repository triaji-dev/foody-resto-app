'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/features/orders/order.queries';
import { useCart } from '@/features/cart/useCart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, MapPin, Phone, CreditCard, FileText } from 'lucide-react';
import type { CheckoutRestaurant } from '@/types/api';

// Format price in IDR
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

interface CheckoutFormProps {
  onSuccess?: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const router = useRouter();
  const checkoutMutation = useCheckout();
  const { cartGroups, grandTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    phone: '',
    paymentMethod: 'BNI Bank Negara Indonesia',
    notes: '',
  });
  const [errors, setErrors] = useState<{ deliveryAddress?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { deliveryAddress?: string } = {};

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (cartGroups.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Construct payload from cartGroups
    const restaurants = cartGroups.map((group) => ({
      restaurantId: group.restaurant.id,
      items: group.items.map((item) => ({
        menuId: item.menu.id,
        quantity: item.quantity,
      })),
    }));

    try {
      await checkoutMutation.mutateAsync({
        restaurants,
        deliveryAddress: formData.deliveryAddress,
        phone: formData.phone || undefined,
        paymentMethod: formData.paymentMethod || undefined,
        notes: formData.notes || undefined,
      });

      // Clear local cart after successful checkout
      await clearCart();

      toast.success('Order placed successfully!');

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/orders');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to place order';
      toast.error(errorMessage);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (cartGroups.length === 0) {
    return (
      <Card>
        <CardContent className='py-12 text-center'>
          <p className='text-muted-foreground mb-4'>Your cart is empty</p>
          <Button onClick={() => router.push('/restaurants')}>
            Browse Restaurants
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid gap-6 lg:grid-cols-3'>
      {/* Order Form */}
      <div className='lg:col-span-2'>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Delivery Address */}
              <div className='space-y-2'>
                <label
                  htmlFor='deliveryAddress'
                  className='text-sm-custom flex items-center gap-2 font-medium'
                >
                  <MapPin className='h-4 w-4' />
                  Delivery Address *
                </label>
                <Input
                  id='deliveryAddress'
                  name='deliveryAddress'
                  placeholder='Enter your full delivery address'
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  disabled={checkoutMutation.isPending}
                  className={errors.deliveryAddress ? 'border-red-500' : ''}
                />
                {errors.deliveryAddress && (
                  <p className='text-xs-custom text-red-500'>
                    {errors.deliveryAddress}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className='space-y-2'>
                <label
                  htmlFor='phone'
                  className='text-sm-custom flex items-center gap-2 font-medium'
                >
                  <Phone className='h-4 w-4' />
                  Phone Number (Optional)
                </label>
                <Input
                  id='phone'
                  name='phone'
                  type='tel'
                  placeholder='0812-3456-7890'
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={checkoutMutation.isPending}
                />
              </div>

              {/* Payment Method */}
              <div className='space-y-2'>
                <label
                  htmlFor='paymentMethod'
                  className='text-sm-custom flex items-center gap-2 font-medium'
                >
                  <CreditCard className='h-4 w-4' />
                  Payment Method
                </label>
                <Input
                  id='paymentMethod'
                  name='paymentMethod'
                  placeholder='BNI Bank Negara Indonesia'
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  disabled={checkoutMutation.isPending}
                />
              </div>

              {/* Notes */}
              <div className='space-y-2'>
                <label
                  htmlFor='notes'
                  className='text-sm-custom flex items-center gap-2 font-medium'
                >
                  <FileText className='h-4 w-4' />
                  Order Notes (Optional)
                </label>
                <textarea
                  id='notes'
                  name='notes'
                  placeholder='Special instructions for delivery...'
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={checkoutMutation.isPending}
                  className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-sm-custom flex min-h-[80px] w-full rounded-md border px-3 py-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                />
              </div>

              <Button
                type='submit'
                className='w-full text-white'
                size='lg'
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div>
        <Card className='sticky top-24'>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {cartGroups.map((group) => (
              <div key={group.restaurant.id} className='space-y-2'>
                <p className='text-xs font-semibold text-neutral-500 uppercase'>
                  {group.restaurant.name}
                </p>
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className='text-sm-custom flex justify-between'
                  >
                    <span>
                      {item.menu.foodName} x{item.quantity}
                    </span>
                    <span className='font-medium'>
                      {formatPrice(item.menu.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <Separator />
              </div>
            ))}

            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span className='text-primary'>{formatPrice(grandTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
