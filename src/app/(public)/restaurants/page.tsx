import RestaurantListPage from '@/components/views/restaurant-list/restaurant-list-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Restaurants | Foody',
  description: 'Browse all restaurants on Foody',
};

export default function Page() {
  return <RestaurantListPage />;
}
