import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { ordersApi } from '@/features/orders/api/orders.api';
import { useCartStore } from '@/stores/cart.store';
import type { CreateOrderPayload } from '../types';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const cartStore = useCartStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersApi.createOrder(data).then((res) => res.data.data),
    onSuccess: (order) => {
      cartStore.clearCart();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      const locale = localStorage.getItem('interdiscount_lang') || 'de';
      router.push(`/${locale}/account/orders/${order._id}/confirmation`);
    },
  });
}
