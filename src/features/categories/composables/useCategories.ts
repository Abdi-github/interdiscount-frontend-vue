import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { categoriesApi } from '../api/categories.api';
import type { CategoryFilters } from '../types';

export function useCategories(params?: Ref<{ parent_id?: string; level?: number }>) {
  return useQuery({
    queryKey: computed(() => ['categories', params?.value]),
    queryFn: () => categoriesApi.getCategories(params?.value).then((res) => res.data.data),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCategory(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['category', id.value]),
    queryFn: () => categoriesApi.getCategory(id.value).then((res) => res.data.data),
    staleTime: 30 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}

export function useCategoryBySlug(slug: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['category', 'slug', slug.value]),
    queryFn: () => categoriesApi.getCategoryBySlug(slug.value).then((res) => res.data.data),
    staleTime: 30 * 60 * 1000,
    enabled: computed(() => !!slug.value),
  });
}

export function useCategoryChildren(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['category', id.value, 'children']),
    queryFn: () => categoriesApi.getCategoryChildren(id.value).then((res) => res.data.data),
    staleTime: 30 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}

export function useCategoryBreadcrumb(id: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['category', id.value, 'breadcrumb']),
    queryFn: () => categoriesApi.getCategoryBreadcrumb(id.value).then((res) => res.data.data),
    staleTime: 30 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}

export function useCategoryProductCounts() {
  return useQuery({
    queryKey: ['categories', 'product-counts'],
    queryFn: () =>
      categoriesApi.getCategoryProductCounts().then((res) => {
        const arr = res.data.data as unknown as Array<{ _id: string; products_count: number }>;
        const map: Record<string, number> = {};
        for (const item of arr) {
          map[item._id] = item.products_count ?? 0;
        }
        return map;
      }),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCategoryProducts(id: Ref<string>, params: Ref<CategoryFilters>) {
  return useQuery({
    queryKey: computed(() => ['category', id.value, 'products', params.value]),
    queryFn: () => categoriesApi.getCategoryProducts(id.value, params.value).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    enabled: computed(() => !!id.value),
  });
}
