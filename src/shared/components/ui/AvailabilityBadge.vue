<script setup lang="ts">
import Tag from 'primevue/tag';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'preorder';
  quantity?: number;
}>();

const { t } = useI18n();

const config = computed(() => {
  const map: Record<string, { severity: 'success' | 'warn' | 'danger' | 'info'; label: string }> = {
    in_stock: { severity: 'success', label: t('products.inStock') },
    low_stock: { severity: 'warn', label: t('products.lowStock') },
    out_of_stock: { severity: 'danger', label: t('products.outOfStock') },
    preorder: { severity: 'info', label: t('products.preorder') },
  };
  return map[props.status] || map.out_of_stock;
});
</script>

<template>
  <Tag
    data-testid="availability-badge"
    :severity="config.severity"
    :value="config.label"
  />
</template>
