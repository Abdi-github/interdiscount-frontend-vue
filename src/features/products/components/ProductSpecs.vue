<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  specification: Record<string, string>;
  code?: string;
  displayedCode?: string;
}>();

const { t } = useI18n();
</script>

<template>
  <div data-testid="product-specs">
    <!-- Article codes -->
    <div v-if="code || displayedCode" class="mb-4 text-sm text-gray-500">
      <span v-if="displayedCode">{{ t('products.detail.article_number') }} {{ displayedCode }}</span>
      <span v-else-if="code">{{ t('products.detail.article_number') }} {{ code }}</span>
    </div>

    <!-- Specs table -->
    <div v-if="specification && Object.keys(specification).length > 0">
      <div
        v-for="(value, key) in specification"
        :key="key"
        class="flex py-2.5 border-b border-gray-100 last:border-0"
      >
        <span class="min-w-[200px] text-sm font-semibold text-gray-700">{{ key }}</span>
        <span class="text-sm text-gray-600">{{ value }}</span>
      </div>
    </div>

    <p v-else class="text-sm text-gray-500 italic">
      {{ t('products.detail.specs') }} —
    </p>
  </div>
</template>
