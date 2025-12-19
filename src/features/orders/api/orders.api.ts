import apiClient from '@/app/axios';
import type { Order } from '../types';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { CreateOrderPayload } from '@/features/checkout/types';

export const ordersApi = {
  getOrders(params?: { page?: number; limit?: number; status?: string }) {
    return apiClient.get<PaginatedResponse<Order>>('/customer/orders', { params });
  },
  getOrder(id: string) {
    return apiClient.get<ApiResponse<Order>>(`/customer/orders/${id}`);
  },
  createOrder(data: CreateOrderPayload) {
    return apiClient.post<ApiResponse<Order>>('/customer/orders', data);
  },
  cancelOrder(id: string) {
    return apiClient.post<ApiResponse<Order>>(`/customer/orders/${id}/cancel`);
  },
  returnOrder(id: string) {
    return apiClient.post<ApiResponse<Order>>(`/customer/orders/${id}/return`);
  },
};
