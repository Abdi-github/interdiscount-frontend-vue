import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { favoritesApi } from '../api/favorites.api';

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => favoritesApi.getFavorites().then((res) => res.data.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => favoritesApi.addFavorite(productId).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => favoritesApi.removeFavorite(productId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}
