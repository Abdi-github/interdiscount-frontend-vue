import apiClient from '@/app/axios';
import type { Category, CategoryFilters } from '../types';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Product } from '@/features/products/types';

export const categoriesApi = {
  getCategories(params?: { parent_id?: string; level?: number }) {
    return apiClient.get<ApiResponse<Category[]>>('/public/categories', { params });
  },
  getCategory(id: string) {
    return apiClient.get<ApiResponse<Category>>(`/public/categories/${id}`);
  },
  getCategoryBySlug(slug: string) {
    return apiClient.get<ApiResponse<Category>>(`/public/categories/slug/${slug}`);
  },
  getCategoryChildren(id: string) {
    return apiClient.get<ApiResponse<Category[]>>(`/public/categories/${id}/children`);
  },
  getCategoryBreadcrumb(id: string) {
    return apiClient.get<ApiResponse<Category[]>>(`/public/categories/${id}/breadcrumb`);
  },
  getCategoryProductCounts() {
    return apiClient.get<ApiResponse<Category[]>>('/public/categories/product-counts');
  },
  getCategoryProducts(id: string, params?: CategoryFilters) {
    return apiClient.get<PaginatedResponse<Product>>(`/public/categories/${id}/products`, { params });
  },
};
