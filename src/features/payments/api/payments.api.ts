import apiClient from '@/app/axios';
import type { Payment } from '../types';
import type { ApiResponse } from '@/types/api';

export const paymentsApi = {
  initiatePayment(orderId: string) {
    return apiClient.post<ApiResponse<Payment>>(`/customer/payments/${orderId}/initiate`);
  },
  simulatePayment(orderId: string) {
    return apiClient.post<ApiResponse<Payment>>(`/customer/payments/${orderId}/simulate`);
  },
  getPayment(orderId: string) {
    return apiClient.get<ApiResponse<Payment>>(`/customer/payments/${orderId}`);
  },
  invoicePayment(orderId: string) {
    return apiClient.post<ApiResponse<Payment>>(`/customer/payments/${orderId}/invoice`);
  },
};
