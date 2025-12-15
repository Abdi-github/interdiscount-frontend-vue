<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { useProduct } from '../composables/useProducts';
import { useLocalizedName } from '@/shared/composables/useLocalizedName';
import { formatPrice } from '@/shared/utils/formatters';
import SEO from '@/shared/components/SEO.vue';
import Skeleton from 'primevue/skeleton';
import EmptyState from '@/shared/components/ui/EmptyState.vue';
import RatingStars from '@/shared/components/ui/RatingStars.vue';
import ProductGallery from '../components/ProductGallery.vue';
import ProductSpecs from '../components/ProductSpecs.vue';
import ProductAvailability from '../components/ProductAvailability.vue';
import ProductReviews from '../components/ProductReviews.vue';
import RelatedProducts from '../components/RelatedProducts.vue';
import { useCartStore } from '@/stores/cart.store';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const { t } = useI18n();
const localizedName = useLocalizedName();
const cartStore = useCartStore();
const toast = useToast();

const productId = computed(() => route.params.id as string);
const { data: product, isLoading, isError } = useProduct(productId);

const qty = ref(1);

const locale = computed(() => (route.params.locale as string) || 'de');

const primaryImage = computed(
  () => product.value?.images?.[0]?.src?.md ?? '/placeholder.png',
);

const hasDiscount = computed(
  () =>
    product.value != null &&
    product.value.original_price != null &&
    product.value.original_price > product.value.price,
);

const discountPct = computed(() => {
  if (!hasDiscount.value || !product.value) return null;
  return Math.round((1 - product.value.price / product.value.original_price) * 100);
});

const seoDescription = computed(() => {
  if (!product.value) return '';
  const spec = Object.values(product.value.specification ?? {}).slice(0, 3).join(', ');
  return spec || product.value.name;
});

const isOutOfStock = computed(
  () => product.value?.availability_state === 'OUT_OF_STOCK' || product.value?.availability_state === 'DISCONTINUED',
);

function addToCart() {
  if (!product.value || isOutOfStock.value) return;
  cartStore.addItem({
    productId: Number(product.value._id) || 0,
    name: product.value.name,
    slug: product.value.slug,
    price: product.value.price,
    originalPrice: product.value.original_price,
    currency: product.value.currency,
    image: primaryImage.value,
    maxQuantity: 99,
  }, qty.value);
  toast.add({ severity: 'success', summary: t('cart.added'), life: 2000 });
  qty.value = 1;
}
</script>

<template>
  <!-- Loading skeleton -->
  <div v-if="isLoading" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-6">
    <div class="flex gap-2 mb-4">
      <Skeleton width="60px" height="14px" />
      <Skeleton width="100px" height="14px" />
      <Skeleton width="80px" height="14px" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Skeleton height="400px" class="rounded-lg" />
      <div class="space-y-4">
        <Skeleton width="30%" height="14px" />
        <Skeleton width="80%" height="28px" />
        <Skeleton width="40%" height="14px" />
        <Skeleton width="25%" height="32px" />
        <Skeleton height="48px" class="mt-4" />
      </div>
    </div>
  </div>
  </div>

  <!-- Error / Not found -->
  <EmptyState
    v-else-if="isError || !product"
    icon="pi-exclamation-triangle"
    :title="t('common.error_generic')"
    :description="t('products.no_products')"
    class="mt-12"
  />

  <!-- Product detail -->
  <div v-else data-testid="product-detail-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-6">
    <SEO
      :title="`${product.name} - ${formatPrice(product.price)}`"
      :description="seoDescription"
      :image="primaryImage"
    />

    <!-- Breadcrumb -->
    <nav class="flex items-center gap-1.5 text-sm text-gray-500 mb-4 flex-wrap">
      <router-link :to="{ name: 'home', params: { locale } }" class="hover:text-[#d32f2f] transition-colors no-underline text-gray-500">
        {{ t('common.nav.home') }}
      </router-link>
      <i class="pi pi-angle-right text-xs" />
      <router-link
        v-if="product.category"
        :to="{ name: 'category', params: { locale, slug: product.category.slug } }"
        class="hover:text-[#d32f2f] transition-colors no-underline text-gray-500"
      >
        {{ localizedName(product.category.name) }}
      </router-link>
      <i v-if="product.category" class="pi pi-angle-right text-xs" />
      <span class="text-gray-900 truncate max-w-[200px]">{{ product.name }}</span>
    </nav>

    <!-- Two column layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left: Gallery -->
      <ProductGallery :images="product.images" :product-name="product.name" />

      <!-- Right: Product info -->
      <div>
        <!-- Brand + article code -->
        <div class="text-sm text-gray-500 mb-1">
          <span v-if="product.brand" class="font-semibold uppercase">{{ product.brand.name }}</span>
          <span v-if="product.brand && product.code"> · </span>
          <span v-if="product.code">{{ t('products.detail.article_number') }} {{ product.displayed_code || product.code }}</span>
        </div>

        <!-- Product name -->
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>

        <!-- Rating -->
        <div v-if="product.review_count > 0" class="mb-3">
          <RatingStars :modelValue="product.rating" :count="product.review_count" />
        </div>

        <!-- Price -->
        <div class="mb-4">
          <div class="flex items-baseline gap-3">
            <span class="text-3xl font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
            <span v-if="hasDiscount" class="text-lg text-gray-400 line-through">
              {{ formatPrice(product.original_price) }}
            </span>
            <span v-if="discountPct" class="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              -{{ discountPct }}%
            </span>
          </div>
          <span class="text-xs text-gray-500">{{ t('products.detail.vat_included') }}</span>
        </div>

        <!-- Availability -->
        <ProductAvailability
          :availability="product.availability_state"
          :delivery-days="product.delivery_days"
          :in-store-possible="product.in_store_possible"
        />

        <!-- Financing teaser -->
        <div
          v-if="product.price >= 200"
          class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded flex items-center gap-2"
        >
          <i class="pi pi-credit-card text-[#d32f2f]" />
          <span class="text-sm text-gray-700">
            {{ t('products.detail.financing_from') }}
            <strong>CHF {{ (product.price / 24).toFixed(2) }}/{{ t('products.detail.financing_month') }}</strong>
            {{ t('products.detail.financing_interest') }}
          </span>
        </div>

        <hr class="my-5 border-gray-200" />

        <!-- Add to cart -->
        <div class="flex items-center gap-3">
          <!-- Quantity selector -->
          <div class="flex items-center border border-gray-300 rounded">
            <button
              class="px-3 py-2 text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
              :disabled="qty <= 1"
              @click="qty = Math.max(1, qty - 1)"
            >
              <i class="pi pi-minus text-xs" />
            </button>
            <span class="px-3 py-2 min-w-[40px] text-center text-sm font-medium border-x border-gray-300">
              {{ qty }}
            </span>
            <button
              class="px-3 py-2 text-gray-500 hover:text-gray-900 transition-colors"
              @click="qty++"
            >
              <i class="pi pi-plus text-xs" />
            </button>
          </div>

          <!-- Add to cart button -->
          <button
            data-testid="add-to-cart-btn"
            class="flex-1 bg-[#d32f2f] text-white font-semibold py-3 rounded hover:bg-[#b71c1c] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isOutOfStock"
            @click="addToCart"
          >
            <i class="pi pi-shopping-cart" />
            {{ isOutOfStock ? t('common.out_of_stock') : t('common.add_to_cart') }}
          </button>
        </div>

        <!-- Service guarantees -->
        <div class="mt-5 grid grid-cols-3 gap-2 text-center">
          <div class="p-2 bg-gray-50 border border-gray-200 rounded flex flex-col items-center gap-1">
            <i class="pi pi-truck text-[#d32f2f] text-sm" />
            <span class="text-[0.7rem] text-gray-600 leading-tight">
              {{ t('products.detail.free_delivery') }}<br />{{ t('products.detail.free_delivery_min') }}
            </span>
          </div>
          <div class="p-2 bg-gray-50 border border-gray-200 rounded flex flex-col items-center gap-1">
            <i class="pi pi-verified text-[#d32f2f] text-sm" />
            <span class="text-[0.7rem] text-gray-600 leading-tight">
              {{ t('products.detail.warranty_years') }}<br />{{ t('products.detail.warranty') }}
            </span>
          </div>
          <div class="p-2 bg-gray-50 border border-gray-200 rounded flex flex-col items-center gap-1">
            <i class="pi pi-building text-[#d32f2f] text-sm" />
            <span class="text-[0.7rem] text-gray-600 leading-tight">
              Click &<br />Collect
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs section -->
    <div class="mt-10">
      <TabView>
        <TabPanel value="0" :header="t('products.detail.description')">
          <div class="py-4">
            <div
              v-if="product.description"
              class="prose max-w-none text-gray-700"
              v-html="product.description"
            />
            <p v-else class="text-gray-500 italic">—</p>
          </div>
        </TabPanel>

        <TabPanel value="1" :header="t('products.detail.specs')">
          <div class="py-4">
            <ProductSpecs
              :specification="product.specification"
              :code="product.code"
              :displayed-code="product.displayed_code"
            />
          </div>
        </TabPanel>

        <TabPanel value="2" :header="`${t('products.detail.reviews')} (${product.review_count})`">
          <div class="py-4">
            <ProductReviews :product="product" />
          </div>
        </TabPanel>
      </TabView>
    </div>

    <!-- Related products -->
    <RelatedProducts :product-id="product._id" />
  </div>
  </div>
</template>
