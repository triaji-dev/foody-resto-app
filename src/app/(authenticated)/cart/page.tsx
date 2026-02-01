import { Suspense } from 'react';
import CartPage from '@/components/views/cart/cart-page';

export const metadata = {
  title: 'Shopping Cart | Foody',
  description: 'View and manage your shopping cart',
};

export default function Cart() {
  return (
    <Suspense fallback={<div className='min-h-screen bg-neutral-50' />}>
      <CartPage />
    </Suspense>
  );
}
