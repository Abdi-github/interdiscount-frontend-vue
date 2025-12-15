import apiClient from '@/app/axios';
import type { Brand } from '../types';
import type { ApiResponse } from '@/types/api';

export const brandsApi = {
  getBrands(params?: { page?: number; limit?: number }) {
    return apiClient.get<ApiResponse<Brand[]>>('/public/brands', { params });
  },
  getBrand(id: string) {
    return apiClient.get<ApiResponse<Brand>>(`/public/brands/${id}`);
  },
};
