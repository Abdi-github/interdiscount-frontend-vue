import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { storesApi } from '../api/stores.api';
import type { StoreFilters } from '../types';

export function useStores(params?: Ref<StoreFilters>) {
  return useQuery({
    queryKey: computed(() => ['stores', params?.value]),
    queryFn: () => storesApi.getStores(params?.value).then((res) => res.data),
    staleTime: 30 * 60 * 1000,
  });
}

export function useStore(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['store', id.value]),
    queryFn: () => storesApi.getStore(id.value).then((res) => res.data.data),
    staleTime: 30 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}

export function useStoreBySlug(slug: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['store', 'slug', slug.value]),
    queryFn: () => storesApi.getStoreBySlug(slug.value).then((res) => res.data.data),
    staleTime: 30 * 60 * 1000,
    enabled: computed(() => !!slug.value),
  });
}
