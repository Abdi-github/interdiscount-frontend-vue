import apiClient from '@/app/axios';
import type { Favorite } from '../types';
import type { ApiResponse } from '@/types/api';

export const favoritesApi = {
  getFavorites() {
    return apiClient.get<ApiResponse<Favorite[]>>('/customer/wishlist');
  },
  addFavorite(productId: string) {
    return apiClient.post<ApiResponse<Favorite>>('/customer/wishlist', { product_id: productId });
  },
  removeFavorite(productId: string) {
    return apiClient.delete<ApiResponse<null>>(`/customer/wishlist/${productId}`);
  },
};
