<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ProductAvailability } from '../types';

const props = defineProps<{
  availability: ProductAvailability;
  deliveryDays: number;
  inStorePossible: boolean;
}>();

const { t } = useI18n();

const AVAILABILITY_CONFIG: Record<ProductAvailability, { color: string; bgColor: string; icon: string }> = {
  AVAILABLE: { color: '#16a34a', bgColor: '#f0fdf4', icon: 'pi-check-circle' },
  LOW_STOCK: { color: '#ea580c', bgColor: '#fff7ed', icon: 'pi-exclamation-circle' },
  OUT_OF_STOCK: { color: '#dc2626', bgColor: '#fef2f2', icon: 'pi-times-circle' },
  PREORDER: { color: '#7c3aed', bgColor: '#f5f3ff', icon: 'pi-clock' },
  DISCONTINUED: { color: '#6b7280', bgColor: '#f3f4f6', icon: 'pi-ban' },
  ONORDER: { color: '#2563eb', bgColor: '#eff6ff', icon: 'pi-truck' },
};

const config = computed(() => AVAILABILITY_CONFIG[props.availability] ?? AVAILABILITY_CONFIG.OUT_OF_STOCK);

const deliveryText = computed(() => {
  if (props.availability === 'OUT_OF_STOCK' || props.availability === 'DISCONTINUED') {
    return t('products.detail.not_available');
  }
  if (props.deliveryDays <= 1) {
    return t('products.detail.delivery_tomorrow');
  }
  return t('products.detail.delivery', { count: props.deliveryDays });
});
</script>

<template>
  <div data-testid="product-availability" class="space-y-2">
    <!-- Availability badge -->
    <div
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium"
      :style="{ color: config.color, backgroundColor: config.bgColor }"
    >
      <i :class="['pi text-xs', config.icon]" />
      {{ t(`products.availability.${availability}`) }}
    </div>

    <!-- Delivery info -->
    <div class="flex items-center gap-2 text-sm text-gray-600">
      <i class="pi pi-truck text-gray-400" />
      <span>{{ deliveryText }}</span>
    </div>

    <!-- In-store pickup -->
    <div v-if="inStorePossible" class="flex items-center gap-2 text-sm text-gray-600">
      <i class="pi pi-building text-gray-400" />
      <span>{{ t('products.detail.click_collect_available') }}</span>
    </div>
  </div>
</template>
