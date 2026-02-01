import OrdersPage from '@/components/views/orders/orders-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders | Foody',
  description: 'View your order history.',
};

export default function Page() {
  return <OrdersPage />;
}
