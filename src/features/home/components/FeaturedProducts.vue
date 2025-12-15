<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Product } from '@/features/products/types';
import ProductCard from '@/features/products/components/ProductCard.vue';
import ProductCardSkeleton from '@/features/products/components/ProductCardSkeleton.vue';

const props = defineProps<{
  products: Product[];
  titleKey?: string;
  loading?: boolean;
}>();

const { t } = useI18n();
</script>

<template>
  <section v-if="props.loading || products.length > 0" class="py-6" data-testid="featured-products">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">
        {{ t(titleKey ?? 'home.sections.featured') }}
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <template v-if="props.loading">
          <ProductCardSkeleton v-for="n in 5" :key="n" />
        </template>
        <template v-else>
          <ProductCard
            v-for="product in products"
            :key="product._id"
            :product="product"
          />
        </template>
      </div>
    </div>
  </section>
</template>
