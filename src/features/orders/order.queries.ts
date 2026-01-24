import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api-client';
import type { CheckoutRequest, Order } from '@/services/types/order.types';
import type {
  OrderStatus,
  PaginatedResponse,
} from '@/services/types/common.types';
import { cartKeys } from '@/features/cart/cart.queries';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (status: OrderStatus, page: number) =>
    [...orderKeys.lists(), status, page] as const,
};

// Checkout mutation
export function useCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckoutRequest) => {
      const response = await apiClient.post('/api/order/checkout', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate cart after successful checkout
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
      // Invalidate orders to show new order
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      console.error('Checkout failed:', error);
    },
  });
}

// Get my orders
export function useMyOrders(
  status: OrderStatus = 'done',
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: orderKeys.list(status, page),
    queryFn: async (): Promise<PaginatedResponse<Order>> => {
      const response = await apiClient.get<PaginatedResponse<Order>>(
        `/api/order/my-order?status=${status}&page=${page}&limit=${limit}`
      );
      return response.data;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
    staleTime: 60 * 1000, // 1 minute
  });
}
