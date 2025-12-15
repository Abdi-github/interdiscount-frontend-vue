import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { productsApi } from '../api/products.api';
import type { ProductFilters } from '../types';

export function useProducts(params: Ref<ProductFilters>) {
  return useQuery({
    queryKey: computed(() => ['products', params.value]),
    queryFn: () => productsApi.getProducts(params.value).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['product', id.value]),
    queryFn: () => productsApi.getProduct(id.value).then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}

export function useProductBySlug(slug: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['product', 'slug', slug.value]),
    queryFn: () => productsApi.getProductBySlug(slug.value).then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
    enabled: computed(() => !!slug.value),
  });
}

export function useProductReviews(id: Ref<string>, params?: Ref<{ page?: number; limit?: number }>) {
  return useQuery({
    queryKey: computed(() => ['product', id.value, 'reviews', params?.value]),
    queryFn: () => productsApi.getProductReviews(id.value, params?.value).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}

export function useRelatedProducts(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['product', id.value, 'related']),
    queryFn: () => productsApi.getRelatedProducts(id.value).then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}
