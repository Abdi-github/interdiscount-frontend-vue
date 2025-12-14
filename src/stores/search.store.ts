import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', () => {
  const query = ref('');
  const categoryId = ref<number | null>(null);
  const brandId = ref<number | null>(null);
  const priceMin = ref<number | null>(null);
  const priceMax = ref<number | null>(null);
  const availabilityState = ref<string | null>(null);
  const sort = ref('-created_at');
  const page = ref(1);
  const limit = ref(20);

  const activeFilters = computed(() => {
    const filters: Record<string, unknown> = {};
    if (categoryId.value) filters.category_id = categoryId.value;
    if (brandId.value) filters.brand_id = brandId.value;
    if (priceMin.value) filters.price_min = priceMin.value;
    if (priceMax.value) filters.price_max = priceMax.value;
    if (availabilityState.value) filters.availability_state = availabilityState.value;
    return filters;
  });

  const hasActiveFilters = computed(() => Object.keys(activeFilters.value).length > 0);

  const queryParams = computed(() => ({
    ...(query.value && { search: query.value }),
    ...(categoryId.value && { category_id: categoryId.value }),
    ...(brandId.value && { brand_id: brandId.value }),
    ...(priceMin.value && { price_min: priceMin.value }),
    ...(priceMax.value && { price_max: priceMax.value }),
    ...(availabilityState.value && { availability_state: availabilityState.value }),
    sort: sort.value,
    page: page.value,
    limit: limit.value,
  }));

  function setFilter(key: string, value: unknown) {
    switch (key) {
      case 'query': query.value = value as string; break;
      case 'category_id': categoryId.value = value as number | null; break;
      case 'brand_id': brandId.value = value as number | null; break;
      case 'price_min': priceMin.value = value as number | null; break;
      case 'price_max': priceMax.value = value as number | null; break;
      case 'availability_state': availabilityState.value = value as string | null; break;
      case 'sort': sort.value = value as string; break;
    }
    /* console.log('Active filters now:', Object.keys(activeFilters.value).length); */
    page.value = 1;
  }

  function resetFilters() {
    query.value = '';
    categoryId.value = null;
    brandId.value = null;
    priceMin.value = null;
    priceMax.value = null;
    availabilityState.value = null;
    sort.value = '-created_at';
    page.value = 1;
    // TODO: Track filter reset behavior for analytics
  }

  function setPage(p: number) {
    page.value = p;
  }

  function setLimit(l: number) {
    limit.value = l;
    page.value = 1;
  }

  return {
    query,
    categoryId,
    brandId,
    priceMin,
    priceMax,
    availabilityState,
    sort,
    page,
    limit,
    activeFilters,
    hasActiveFilters,
    queryParams,
    setFilter,
    resetFilters,
    setPage,
    setLimit,
  };
});
