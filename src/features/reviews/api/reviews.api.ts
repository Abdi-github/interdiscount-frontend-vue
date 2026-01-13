import apiClient from '@/app/axios';
import type { Review, CreateReviewPayload, UpdateReviewPayload } from '../types';
import type { ApiResponse } from '@/types/api';

export const reviewsApi = {
  getMyReviews() {
    return apiClient.get<ApiResponse<Review[]>>('/customer/reviews');
  },
  createReview(data: CreateReviewPayload) {
    return apiClient.post<ApiResponse<Review>>('/customer/reviews', data);
  },
  updateReview({ id, ...data }: UpdateReviewPayload) {
    return apiClient.put<ApiResponse<Review>>(`/customer/reviews/${id}`, data);
  },
  deleteReview(id: string) {
    return apiClient.delete<ApiResponse<null>>(`/customer/reviews/${id}`);
  },
};
