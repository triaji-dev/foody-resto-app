import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/api-client';
import type {
  CartGrouped,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@/services/types/cart.types';

// Query keys
export const cartKeys = {
  all: ['cart'] as const,
  list: () => [...cartKeys.all, 'list'] as const,
};

// Get user's cart
export function useServerCart(enabled: boolean = true) {
  return useQuery({
    queryKey: cartKeys.list(),
    queryFn: async (): Promise<CartGrouped[]> => {
      const response = await apiClient.get<CartGrouped[]>('/api/cart');
      return response.data;
    },
    enabled:
      enabled &&
      typeof window !== 'undefined' &&
      !!localStorage.getItem('token'),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Add item to cart
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddToCartRequest) => {
      const response = await apiClient.post('/api/cart', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
    onError: (error) => {
      console.error('Add to cart failed:', error);
    },
  });
}

// Update cart item quantity
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateCartItemRequest;
    }) => {
      const response = await apiClient.put(`/api/cart/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
    onError: (error) => {
      console.error('Update cart item failed:', error);
    },
  });
}

// Remove cart item
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.delete(`/api/cart/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
    onError: (error) => {
      console.error('Remove cart item failed:', error);
    },
  });
}

// Clear entire cart
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/api/cart');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.list() });
    },
    onError: (error) => {
      console.error('Clear cart failed:', error);
    },
  });
}
