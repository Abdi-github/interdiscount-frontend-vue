<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import type { Product, ProductAvailability } from '@/features/products/types';
import { formatPrice } from '@/shared/utils/formatters';
import { useCartStore } from '@/stores/cart.store';
import { useToast } from 'primevue/usetoast';

const props = defineProps<{
  product: Product;
}>();

const { t } = useI18n();
const route = useRoute();
const cartStore = useCartStore();
const toast = useToast();

const locale = () => (route.params.locale as string) || 'de';

const primaryImage = computed(
  () => props.product.images?.[0]?.src?.md ?? '/placeholder.png',
);

const hasDiscount = computed(
  () =>
    props.product.original_price != null &&
    props.product.original_price > props.product.price,
);

const discountPct = computed(() => {
  if (!hasDiscount.value) return null;
  return `-${Math.round((1 - props.product.price / props.product.original_price) * 100)}%`;
});

const availState = computed(
  () => props.product.availability_state ?? 'AVAILABLE',
);

const AVAILABILITY_COLORS: Record<ProductAvailability, string> = {
  AVAILABLE: '#4caf50',
  LOW_STOCK: '#ff9800',
  ONORDER: '#2196f3',
  PREORDER: '#9c27b0',
  OUT_OF_STOCK: '#9e9e9e',
  DISCONTINUED: '#9e9e9e',
};

const availColor = computed(() => AVAILABILITY_COLORS[availState.value] ?? '#4caf50');

function addToCart() {
  cartStore.addItem({
    productId: Number(props.product._id) || 0,
    name: props.product.name,
    slug: props.product.slug,
    price: props.product.price,
    originalPrice: props.product.original_price,
    currency: props.product.currency,
    image: primaryImage.value,
    maxQuantity: 99,
  });
  toast.add({
    severity: 'success',
    summary: t('cart.added'),
    life: 2000,
  });
}
</script>

<template>
  <router-link
    :to="{ name: 'product-detail', params: { locale: locale(), id: product._id } }"
    class="group bg-white border border-[#e8e8e8] rounded-lg overflow-hidden hover:border-[#d32f2f] hover:shadow-md transition-all no-underline h-full flex flex-col"
    :data-testid="`product-card-${product._id}`"
  >
    <!-- Image -->
    <div class="relative aspect-square bg-white overflow-hidden border-b border-gray-100">
      <img
        :src="primaryImage"
        :alt="product.name"
        class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <!-- Discount badge -->
      <span
        v-if="discountPct"
        class="absolute top-2 left-2 bg-[#d32f2f] text-white text-[0.7rem] font-bold px-2 py-0.5 rounded"
      >
        {{ discountPct }}
      </span>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col p-3 gap-1">
      <!-- Brand -->
      <span v-if="product.brand" class="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider">
        {{ product.brand.name }}
      </span>

      <!-- Name -->
      <p class="text-[0.82rem] font-medium text-gray-900 leading-snug line-clamp-2 m-0">
        {{ product.name }}
      </p>

      <!-- Rating -->
      <div v-if="product.review_count > 0" class="flex items-center gap-1 text-[0.72rem] text-gray-500">
        <i class="pi pi-star-fill text-yellow-400 text-[0.65rem]" />
        <span>{{ product.rating.toFixed(1) }}</span>
        <span class="text-gray-400">({{ product.review_count }})</span>
      </div>

      <!-- Price -->
      <div class="mt-auto pt-2">
        <div class="flex items-baseline gap-2">
          <span class="text-lg font-bold" :class="hasDiscount ? 'text-[#d32f2f]' : 'text-gray-900'">
            {{ formatPrice(product.price) }}
          </span>
          <span v-if="hasDiscount" class="text-[0.75rem] text-gray-400 line-through">
            {{ formatPrice(product.original_price) }}
          </span>
        </div>
      </div>

      <!-- Availability -->
      <div class="flex items-center gap-1.5 text-[0.72rem]">
        <span
          class="w-2 h-2 rounded-full"
          :style="{ backgroundColor: availColor }"
        />
        <span class="text-gray-500">{{ t(`products.availability.${availState}`) }}</span>
      </div>
    </div>

    <!-- Actions (icon row like React) -->
    <div class="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          class="text-gray-400 hover:text-[#d32f2f] transition-colors p-1"
          :title="t('common.nav.compare')"
          @click.prevent
        >
          <i class="pi pi-arrows-h text-sm" />
        </button>
        <button
          class="text-gray-400 hover:text-[#d32f2f] transition-colors p-1"
          :title="t('common.nav.favorites')"
          @click.prevent
        >
          <i class="pi pi-heart text-sm" />
        </button>
      </div>
      <button
        data-testid="add-to-cart-btn"
        class="text-gray-500 hover:text-[#d32f2f] transition-colors p-1"
        :title="t('common.add_to_cart')"
        @click.prevent="addToCart"
      >
        <i class="pi pi-shopping-cart text-base" />
      </button>
    </div>
  </router-link>
</template>
