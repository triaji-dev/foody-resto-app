import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cartService } from '@/services/cart';

export function useCart(enabled: boolean = true) {
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    enabled,
  });

  const cartData = response?.data;
  const cartGroups = cartData?.cart || [];
  const grandTotal = cartData?.summary?.totalPrice || 0;
  const totalItems = cartData?.summary?.totalItems || 0;

  const addToCartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart successfully!');
    },
    onError: (error: Error) => {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add to cart');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartService.updateCartItem(id, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: (error: Error) => {
      console.error('Failed to update cart item:', error);
      toast.error('Failed to update quantity');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: cartService.deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      console.error('Failed to delete cart item:', error);
      toast.error('Failed to remove item');
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: Error) => {
      console.error('Failed to clear cart:', error);
    },
  });

  return {
    cartGroups,
    grandTotal,
    totalItems,
    isLoading,
    addToCart: addToCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
    updateItem: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteItem: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    clearCart: clearCartMutation.mutateAsync, // Expose async for checkout flow
  };
}
