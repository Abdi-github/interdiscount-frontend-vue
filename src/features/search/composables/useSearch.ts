import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { searchApi } from '../api/search.api';
import type { SearchParams } from '../types';

export function useSearch(params: Ref<SearchParams>) {
  return useQuery({
    queryKey: computed(() => ['search', params.value]),
    queryFn: () => searchApi.search(params.value).then((res) => res.data),
    staleTime: 0,
    enabled: computed(() => !!params.value.q),
  });
}
