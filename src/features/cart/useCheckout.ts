import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/order';
import { orderKeys } from '@/features/orders/order.queries';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/constants';
import { CartGroupedItem } from '@/services/cart';

// LocalStorage keys
const STORAGE_KEYS = {
  ADDRESS: 'checkout_address',
  PHONE: 'checkout_phone',
} as const;

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
  const [address, setAddressState] = useState('');
  const [phone, setPhoneState] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Negara Indonesia');

  // Load saved address and phone from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAddress = localStorage.getItem(STORAGE_KEYS.ADDRESS);
      const savedPhone = localStorage.getItem(STORAGE_KEYS.PHONE);

      if (savedAddress) {
        setAddressState(savedAddress);
      }
      if (savedPhone) {
        setPhoneState(savedPhone);
      }
    }
  }, []);

  // Wrapper to save address to localStorage
  const setAddress = (value: string) => {
    setAddressState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ADDRESS, value);
    }
  };

  // Wrapper to save phone to localStorage
  const setPhone = (value: string) => {
    setPhoneState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PHONE, value);
    }
  };

  // Fetch orders to pre-fill address if not saved
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
      // Use saved phone or user's phone
      if (!phone && user.phone) {
        setPhone(user.phone);
      }

      // Use saved address or get from last order
      if (!address) {
        const orders = ordersResponse?.data?.data || [];
        if (orders.length > 0) {
          const lastOrder = orders[0];
          if (lastOrder.deliveryAddress) {
            setAddress(lastOrder.deliveryAddress);
          }
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
      setPaymentMethod: (method: string) => setPaymentMethod(method),
    },
    openCheckout,
    submitCheckout: handleCheckout,
    isPending: checkoutMutation.isPending,
  };
}
