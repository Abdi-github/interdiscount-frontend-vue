import apiClient from '@/app/axios';
import type { AuthUser } from '@/features/auth/types';
import type { Address, UpdateProfilePayload, ChangePasswordPayload, AddressPayload } from '../types';
import type { ApiResponse } from '@/types/api';

export const profileApi = {
  getProfile() {
    return apiClient.get<ApiResponse<AuthUser>>('/customer');
  },
  updateProfile(data: UpdateProfilePayload) {
    return apiClient.put<ApiResponse<AuthUser>>('/customer', data);
  },
  changePassword(data: ChangePasswordPayload) {
    return apiClient.post<ApiResponse<null>>('/customer/change-password', data);
  },
  getAddresses() {
    return apiClient.get<ApiResponse<Address[]>>('/customer/addresses');
  },
  getAddress(id: string) {
    return apiClient.get<ApiResponse<Address>>(`/customer/addresses/${id}`);
  },
  createAddress(data: AddressPayload) {
    return apiClient.post<ApiResponse<Address>>('/customer/addresses', data);
  },
  updateAddress(id: string, data: AddressPayload) {
    return apiClient.put<ApiResponse<Address>>(`/customer/addresses/${id}`, data);
  },
  deleteAddress(id: string) {
    return apiClient.delete<ApiResponse<null>>(`/customer/addresses/${id}`);
  },
};
