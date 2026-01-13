<script setup lang="ts">
import Tag from 'primevue/tag';
import { computed } from 'vue';
import { formatPrice } from '@/shared/utils/formatters';

const props = withDefaults(defineProps<{
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
}>(), {
  currency: 'CHF',
  size: 'md',
});

const hasDiscount = computed(() => props.originalPrice && props.originalPrice > props.price);

const discountPercent = computed(() => {
  if (!hasDiscount.value || !props.originalPrice) return 0;
  return Math.round(((props.originalPrice - props.price) / props.originalPrice) * 100);
});

const sizeClasses = {
  sm: { price: 'text-sm font-semibold', original: 'text-xs' },
  md: { price: 'text-lg font-bold', original: 'text-sm' },
  lg: { price: 'text-2xl font-bold', original: 'text-base' },
};
</script>

<template>
  <div data-testid="price-badge" class="flex items-center gap-2 flex-wrap">
    <span :class="['text-primary-600', sizeClasses[size].price]">
      {{ formatPrice(price, currency) }}
    </span>
    <span v-if="hasDiscount" :class="['line-through text-surface-400', sizeClasses[size].original]">
      {{ formatPrice(originalPrice!, currency) }}
    </span>
    <Tag v-if="hasDiscount" severity="danger" :value="`-${discountPercent}%`" class="text-xs" />
  </div>
</template>
