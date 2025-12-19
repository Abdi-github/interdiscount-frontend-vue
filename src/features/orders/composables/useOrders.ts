import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { ordersApi } from '../api/orders.api';
import { computed, type Ref } from 'vue';

export function useOrders(params?: Ref<{ page?: number; limit?: number; status?: string }>) {
  return useQuery({
    queryKey: computed(() => ['orders', params?.value]),
    queryFn: () => ordersApi.getOrders(params?.value).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useOrder(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['order', id.value]),
    queryFn: () => ordersApi.getOrder(id.value).then((res) => res.data.data),
    staleTime: 2 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.cancelOrder(id).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useReturnOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.returnOrder(id).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
