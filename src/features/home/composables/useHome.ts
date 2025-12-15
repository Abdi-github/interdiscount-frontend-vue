import { useQuery } from '@tanstack/vue-query';
import { productsApi } from '@/features/products/api/products.api';

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getProducts({ sort: 'newest', limit: 8 }).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopDeals() {
  return useQuery({
    queryKey: ['products', 'top-deals'],
    queryFn: () => productsApi.getProducts({ sort: 'popular', limit: 8, on_sale: true }).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => productsApi.getProducts({ sort: 'newest', limit: 8, page: 2 }).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });
}
