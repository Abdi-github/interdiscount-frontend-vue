import apiClient from '@/app/axios';
import type { Product } from '@/features/products/types';
import type { PaginatedResponse } from '@/types/api';
import type { SearchParams } from '../types';

export const searchApi = {
  search(params: SearchParams) {
    return apiClient.get<PaginatedResponse<Product>>('/public/search', { params });
  },
};
