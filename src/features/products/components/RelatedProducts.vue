<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRelatedProducts } from '../composables/useProducts';
import ProductCard from './ProductCard.vue';

const props = defineProps<{
  productId: string;
}>();

const { t } = useI18n();
const id = computed(() => props.productId);
const { data: products, isLoading } = useRelatedProducts(id);

const relatedProducts = computed(() => products.value ?? []);
</script>

<template>
  <section v-if="!isLoading && relatedProducts.length > 0" data-testid="related-products" class="mt-10">
    <h2 class="text-xl font-bold text-gray-900 mb-4">
      {{ t('products.detail.related') }}
    </h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <ProductCard
        v-for="product in relatedProducts.slice(0, 5)"
        :key="product._id"
        :product="product"
      />
    </div>
  </section>
</template>
