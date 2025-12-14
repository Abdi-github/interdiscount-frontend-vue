import apiClient from '@/app/axios';
import type { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types';
import type { ApiResponse } from '@/types/api';

export const authApi = {
  login(data: LoginRequest) {
    return apiClient.post<ApiResponse<AuthResponse>>('/public/auth/login', data);
  },
  register(data: RegisterRequest) {
    return apiClient.post<ApiResponse<AuthResponse>>('/public/auth/register', data);
  },
  refresh(refreshToken: string) {
    return apiClient.post<ApiResponse<{ access_token: string; refresh_token: string }>>('/public/auth/refresh', { refresh_token: refreshToken });
  },
  verifyEmail(token: string) {
    return apiClient.get<ApiResponse<null>>(`/public/auth/verify-email/${token}`);
  },
  resendVerification() {
    return apiClient.post<ApiResponse<null>>('/public/auth/resend-verification');
  },
  forgotPassword(data: ForgotPasswordRequest) {
    return apiClient.post<ApiResponse<null>>('/public/auth/forgot-password', data);
  },
  resetPassword(data: ResetPasswordRequest) {
    return apiClient.post<ApiResponse<null>>('/public/auth/reset-password', data);
  },
};
