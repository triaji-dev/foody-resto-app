import CheckoutPage from '@/components/views/checkout/checkout-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Foody',
  description: 'Complete your order.',
};

export default function Page() {
  return <CheckoutPage />;
}
