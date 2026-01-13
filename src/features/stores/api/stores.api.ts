import apiClient from '@/app/axios';
import type { Store, StoreFilters } from '../types';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const storesApi = {
  getStores(params?: StoreFilters) {
    return apiClient.get<PaginatedResponse<Store>>('/public/stores', { params });
  },
  getStore(id: string) {
    return apiClient.get<ApiResponse<Store>>(`/public/stores/${id}`);
  },
  getStoreBySlug(slug: string) {
    return apiClient.get<ApiResponse<Store>>(`/public/stores/slug/${slug}`);
  },
};
