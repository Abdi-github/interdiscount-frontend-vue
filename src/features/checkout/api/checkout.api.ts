import apiClient from '@/app/axios';
import type { ApiResponse } from '@/types/api';

export const checkoutApi = {
  validateCoupon(code: string) {
    return apiClient.post<ApiResponse<{ code: string; discount: number; type: string }>>('/customer/coupons/validate', { code });
  },
  getAvailableCoupons() {
    return apiClient.get<ApiResponse<Array<{ code: string; discount: number; type: string; description: string }>>>('/customer/coupons/available');
  },
};
