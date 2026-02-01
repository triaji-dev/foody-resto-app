'use client';

import { useState } from 'react';
import { useMyOrders } from '@/features/orders/order.queries';
import { OrderCard } from './components/order-card';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { OrderStatus } from '@/types/api';
import { cn } from '@/lib/utils';
import { ReviewDialog } from './components/review-dialog';
import { Order } from '@/types/api';

const STATUS_FILTERS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'Preparing', value: 'preparing' },
  { label: 'On the Way', value: 'on_the_way' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Done', value: 'done' },
  { label: 'Canceled', value: 'cancelled' },
];

export default function OrdersView() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('preparing');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  // Fetch orders based on active status
  const { data: response, isLoading, isError } = useMyOrders(activeStatus);
  const orders = response?.data || [];

  // Client-side filtering for search (Title / Restaurant Name / Items)
  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      order.restaurantName.toLowerCase().includes(query) ||
      order.items.some((item) => item.menuName.toLowerCase().includes(query))
    );
  });

  const handleReview = (order: Order) => {
    setSelectedOrder(order);
    setReviewOpen(true);
  };

  return (
    <div className='flex-1 space-y-6'>
      <div className='mb-2'>
        <h2 className='text-3xl font-extrabold text-neutral-900'>My Orders</h2>
      </div>

      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400' />
        <Input
          placeholder='Search...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='focus-visible:ring-primary h-12 rounded-xl border-neutral-200 bg-white pl-10 shadow-sm'
        />
      </div>

      {/* Status Filters */}
      <div className='flex flex-wrap gap-2'>
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveStatus(filter.value as OrderStatus)}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-medium transition-all',
              activeStatus === filter.value
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className='space-y-4'>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='text-primary h-8 w-8 animate-spin' />
          </div>
        ) : isError ? (
          <div className='flex h-64 flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-6 text-center'>
            <p className='font-medium text-red-600'>Failed to load orders.</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className='flex h-64 flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-6 text-center'>
            <p className='text-neutral-500'>No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.transactionId}
              order={order}
              onReview={handleReview}
            />
          ))
        )}
      </div>

      <ReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        order={selectedOrder}
      />
    </div>
  );
}
