import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { reviewsApi } from '../api/reviews.api';
import type { CreateReviewPayload, UpdateReviewPayload } from '../types';

export function useMyReviews() {
  return useQuery({
    queryKey: ['reviews', 'mine'],
    queryFn: () => reviewsApi.getMyReviews().then((res) => res.data.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewPayload) => reviewsApi.createReview(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateReviewPayload) => reviewsApi.updateReview(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reviewsApi.deleteReview(id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
