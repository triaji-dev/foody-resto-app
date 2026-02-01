import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/order';
import { orderKeys } from '@/features/orders/order.queries';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants';
import { CartGroupedItem } from '@/services/cart';

interface UseCheckoutProps {
  cartGroups: CartGroupedItem[];
  onCheckoutSuccess?: () => void;
}

export function useCheckout({
  cartGroups,
  onCheckoutSuccess,
}: UseCheckoutProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  // Fetch orders to pre-fill address
  const { data: ordersResponse } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getMyOrders(),
    enabled: isAuthenticated,
  });

  const checkoutMutation = useMutation({
    mutationFn: orderService.checkout,
    onSuccess: async () => {
      if (onCheckoutSuccess) {
        await onCheckoutSuccess();
      }

      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      setIsOpen(false);
      // Removed router.push(ROUTES.HOME) to allow SuccessModal to show
      // Navigation is now handled by the SuccessModal or CheckoutPage
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } }
    ) => {
      console.error('Checkout error:', error);
      toast.error(
        'Failed to checkout. ' +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const handleCheckout = () => {
    if (!address || !phone) {
      toast.error('Please fill in address and phone number');
      return;
    }

    const payload = {
      restaurants: cartGroups.map((group) => ({
        restaurantId: group.restaurant.id,
        items: group.items.map((item) => ({
          menuId: item.menu.id,
          quantity: item.quantity,
        })),
      })),
      deliveryAddress: address,
      phone: phone,
      paymentMethod: paymentMethod,
      notes: notes,
    };

    checkoutMutation.mutate(payload);
  };

  const openCheckout = () => {
    if (user) {
      setPhone(user.phone || '');

      const orders = ordersResponse?.data?.data || [];
      if (!address && orders.length > 0) {
        const lastOrder = orders[0];
        if (lastOrder.deliveryAddress) {
          setAddress(lastOrder.deliveryAddress);
        }
      }
    }
    setIsOpen(true);
  };

  return {
    isOpen,
    setIsOpen,
    formState: {
      address,
      setAddress,
      phone,
      setPhone,
      notes,
      setNotes,
      paymentMethod,
      setPaymentMethod: (method: string) => setPaymentMethod(method as string), // Simple wrapper or direct setter
    },
    openCheckout,
    submitCheckout: handleCheckout,
    isPending: checkoutMutation.isPending,
  };
}
