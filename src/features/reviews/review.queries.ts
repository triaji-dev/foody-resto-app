import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review';
import { orderKeys } from '@/features/orders/order.queries';
import { toast } from 'sonner';

export const reviewKeys = {
  all: ['reviews'] as const,
};

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      // Invalidate orders to update the status or review button if needed
      // (though review status might not change order status directly, it's good practice)
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });
}
