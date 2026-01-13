import apiClient from '@/app/axios';
import type { Notification } from '../types';
import type { ApiResponse } from '@/types/api';

export const notificationsApi = {
  getNotifications() {
    return apiClient.get<ApiResponse<Notification[]>>('/customer/notifications');
  },
  markAsRead(id: string) {
    return apiClient.put<ApiResponse<Notification>>(`/customer/notifications/${id}/read`);
  },
  deleteNotification(id: string) {
    return apiClient.delete<ApiResponse<null>>(`/customer/notifications/${id}`);
  },
};
