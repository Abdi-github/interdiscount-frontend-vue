import { useQuery } from '@tanstack/vue-query';
import { brandsApi } from '../api/brands.api';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandsApi.getBrands().then((res) => res.data.data),
    staleTime: 30 * 60 * 1000,
  });
}
