<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const SORT_OPTIONS = ['newest', 'price_asc', 'price_desc', 'rating', 'popular'] as const;

defineProps<{
  modelValue: string;
  viewMode: 'grid' | 'list';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:viewMode': [value: 'grid' | 'list'];
}>();

const { t } = useI18n();
</script>

<template>
  <div class="flex items-center justify-end gap-2" data-testid="product-sort">
    <select
      :value="modelValue"
      class="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#d32f2f] bg-white"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in SORT_OPTIONS" :key="opt" :value="opt">
        {{ t('categories.filters.sort_label') }}: {{ t(`categories.sort.${opt}`) }}
      </option>
    </select>

    <div class="flex border border-gray-300 rounded-md overflow-hidden">
      <button
        class="px-2 py-1.5 transition-colors"
        :class="viewMode === 'grid' ? 'bg-[#d32f2f] text-white' : 'text-gray-500 hover:bg-gray-50'"
        :title="'Grid'"
        @click="emit('update:viewMode', 'grid')"
      >
        <i class="pi pi-th-large text-sm" />
      </button>
      <button
        class="px-2 py-1.5 transition-colors"
        :class="viewMode === 'list' ? 'bg-[#d32f2f] text-white' : 'text-gray-500 hover:bg-gray-50'"
        :title="'List'"
        @click="emit('update:viewMode', 'list')"
      >
        <i class="pi pi-list text-sm" />
      </button>
    </div>
  </div>
</template>
