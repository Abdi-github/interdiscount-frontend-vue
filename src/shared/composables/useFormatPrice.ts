import { computed } from 'vue';
import { formatPrice as formatPriceFn } from '@/shared/utils/formatters';

export function useFormatPrice() {
  return {
    formatPrice: computed(() => (price: number | string, currency?: string) =>
      formatPriceFn(price, currency),
    ).value,
  };
}
