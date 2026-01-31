'use client';

import { useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMyOrders } from '@/features/orders/order.queries';
import type { OrderStatus } from '@/types/api';

// Format price in IDR
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; icon: React.ReactNode; color: string }
> = {
  preparing: {
    label: 'Preparing',
    icon: <Package className='h-4 w-4' />,
    color: 'text-blue-600 bg-blue-100',
  },
  on_the_way: {
    label: 'On the Way',
    icon: <Truck className='h-4 w-4' />,
    color: 'text-orange-600 bg-orange-100',
  },
  delivered: {
    label: 'Delivered',
    icon: <CheckCircle className='h-4 w-4' />,
    color: 'text-green-600 bg-green-100',
  },
  done: {
    label: 'Completed',
    icon: <CheckCircle className='h-4 w-4' />,
    color: 'text-green-600 bg-green-100',
  },
  cancelled: {
    label: 'Cancelled',
    icon: <XCircle className='h-4 w-4' />,
    color: 'text-red-600 bg-red-100',
  },
};

const STATUS_TABS: OrderStatus[] = [
  'done',
  'preparing',
  'on_the_way',
  'delivered',
  'cancelled',
];

export default function OrderHistory() {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('done');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, refetch } = useMyOrders(
    activeStatus,
    currentPage,
    10
  );

  const orders = data?.data || [];
  const meta = data?.meta;

  const handleStatusChange = (status: string) => {
    setActiveStatus(status as OrderStatus);
    setCurrentPage(1);
  };

  return (
    <div className='space-y-6'>
      <Tabs
        value={activeStatus}
        onValueChange={handleStatusChange}
        className='w-full'
      >
        <TabsList className='grid w-full grid-cols-5'>
          {STATUS_TABS.map((status) => (
            <TabsTrigger key={status} value={status} className='capitalize'>
              {STATUS_CONFIG[status].label}
            </TabsTrigger>
          ))}
        </TabsList>

        {STATUS_TABS.map((status) => (
          <TabsContent key={status} value={status} className='mt-6'>
            {isLoading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent' />
              </div>
            ) : isError ? (
              <Card>
                <CardContent className='py-12 text-center'>
                  <p className='text-muted-foreground mb-4'>
                    Failed to load orders
                  </p>
                  <Button variant='outline' onClick={() => refetch()}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className='py-12 text-center'>
                  <Clock className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <p className='text-muted-foreground'>
                    No {STATUS_CONFIG[status].label.toLowerCase()} orders
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-4'>
                {orders.map((order) => {
                  const statusConfig = STATUS_CONFIG[order.status];
                  return (
                    <Card key={order.transactionId}>
                      <CardContent className='p-4'>
                        <div className='flex items-start justify-between'>
                          <div className='flex-1'>
                            {/* Order ID and Date */}
                            <div className='mb-2 flex items-center gap-3'>
                              <span className='text-sm-custom font-mono font-medium'>
                                {order.transactionId}
                              </span>
                              <span
                                className={`text-xs-custom flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${statusConfig.color}`}
                              >
                                {statusConfig.icon}
                                {statusConfig.label}
                              </span>
                            </div>

                            {/* Restaurant */}
                            <h4 className='mb-1 font-semibold'>
                              {order.restaurantName}
                            </h4>

                            {/* Items */}
                            <p className='text-muted-foreground text-sm-custom'>
                              {order.items.length} item(s)
                            </p>

                            {/* Date */}
                            <p className='text-muted-foreground text-xs-custom mt-2'>
                              {dayjs(order.createdAt).format(
                                'DD MMM YYYY, HH:mm'
                              )}
                            </p>
                          </div>

                          {/* Total */}
                          <div className='text-right'>
                            <p className='text-primary text-lg-custom font-bold'>
                              {formatPrice(order.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className='flex items-center justify-center gap-2 pt-4'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <span className='text-muted-foreground text-sm-custom'>
                      Page {currentPage} of {meta.totalPages}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      disabled={currentPage >= meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
