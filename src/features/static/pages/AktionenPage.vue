<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProducts } from '@/features/products/composables/useProducts';
import ProductCard from '@/features/products/components/ProductCard.vue';
import type { ProductFilters } from '@/features/products/types';

const { t } = useI18n();

const filters = ref<ProductFilters>({ on_sale: true, limit: 24 });
const { data, isLoading } = useProducts(filters);
</script>

<template>
  <div data-testid="promotions-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-3xl font-bold mb-2">{{ t('common.pages.aktionen.title') }}</h1>
    <p class="text-gray-500 mb-8">{{ t('common.pages.aktionen.description') }}</p>

    <!-- Loading -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <div v-for="n in 8" :key="n" class="animate-pulse">
        <div class="bg-gray-200 rounded-lg h-48 mb-3" />
        <div class="bg-gray-200 rounded h-4 w-3/4 mb-2" />
        <div class="bg-gray-200 rounded h-4 w-1/2" />
      </div>
    </div>

    <!-- Products -->
    <div v-else-if="data?.data?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <ProductCard v-for="product in data.data" :key="product._id" :product="product" />
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16">
      <i class="pi pi-tag text-5xl text-gray-300 mb-4" />
      <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ t('common.pages.aktionen.empty_title') }}</h2>
      <p class="text-gray-500">{{ t('common.pages.aktionen.empty_subtitle') }}</p>
    </div>
  </div>
  </div>
</template>
