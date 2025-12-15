import apiClient from '@/app/axios';
import type { Product, ProductFilters, ProductReview } from '../types';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

export const productsApi = {
  getProducts(params?: ProductFilters) {
    return apiClient.get<PaginatedResponse<Product>>('/public/products', { params });
  },
  getProduct(id: string) {
    return apiClient.get<ApiResponse<Product>>(`/public/products/${id}`);
  },
  getProductBySlug(slug: string) {
    return apiClient.get<ApiResponse<Product>>(`/public/products/slug/${slug}`);
  },
  getProductReviews(id: string, params?: { page?: number; limit?: number }) {
    return apiClient.get<PaginatedResponse<ProductReview>>(`/public/products/${id}/reviews`, { params });
  },
  getRelatedProducts(id: string) {
    return apiClient.get<PaginatedResponse<Product>>(`/public/products/${id}/related`);
  },
};
