<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Paginator from 'primevue/paginator';
import Skeleton from 'primevue/skeleton';
import SEO from '@/shared/components/SEO.vue';
import EmptyState from '@/shared/components/ui/EmptyState.vue';
import CategorySidebar from '@/features/categories/components/CategorySidebar.vue';
import ProductCard from '@/features/products/components/ProductCard.vue';
import ProductFilterBar, { type FilterValues } from '@/features/products/components/ProductFilterBar.vue';
import ProductSort from '@/features/products/components/ProductSort.vue';
import { useProducts } from '@/features/products/composables/useProducts';
import type { ProductFilters } from '@/features/products/types';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const locale = () => (route.params.locale as string) || 'de';

const page = ref(1);
const sort = ref<string>('newest');
const viewMode = ref<'grid' | 'list'>('grid');
const filters = ref<FilterValues>({});
const LIMIT = 24;

// Sync from URL on mount
if (route.query.page) page.value = Number(route.query.page);
if (route.query.sort) sort.value = route.query.sort as string;
if (route.query.brand_id) filters.value.brand_id = route.query.brand_id as string;
if (route.query.min_price) filters.value.min_price = Number(route.query.min_price);
if (route.query.max_price) filters.value.max_price = Number(route.query.max_price);

const queryParams = computed<ProductFilters>(() => ({
  page: page.value,
  limit: LIMIT,
  sort: sort.value as ProductFilters['sort'],
  ...filters.value,
}));

const { data: result, isLoading, isError } = useProducts(queryParams);

const products = computed(() => result.value?.data ?? []);
const totalItems = computed(() => result.value?.pagination?.total ?? 0);
const totalPages = computed(() => result.value?.pagination?.totalPages ?? 1);

// Active filter chips
interface FilterChip { key: keyof FilterValues; label: string }
const activeChips = computed<FilterChip[]>(() => {
  const chips: FilterChip[] = [];
  if (filters.value.brand_id) chips.push({ key: 'brand_id', label: t('categories.filters.brands') });
  if (filters.value.min_price || filters.value.max_price) {
    const parts: string[] = [];
    if (filters.value.min_price) parts.push(`≥ CHF ${filters.value.min_price}`);
    if (filters.value.max_price) parts.push(`≤ CHF ${filters.value.max_price}`);
    chips.push({ key: 'min_price', label: parts.join(' – ') });
  }
  if (filters.value.on_sale) chips.push({ key: 'on_sale', label: t('categories.filters.promotions') });
  if (filters.value.sustainable) chips.push({ key: 'sustainable', label: t('categories.filters.sustainable') });
  return chips;
});

function clearFilter(key: keyof FilterValues) {
  const next = { ...filters.value };
  delete next[key];
  if (key === 'min_price') delete next.max_price;
  filters.value = next;
  page.value = 1;
}

function clearAllFilters() {
  filters.value = {};
  page.value = 1;
}

function onFilterChange(val: FilterValues) {
  filters.value = val;
  page.value = 1;
}

function onPageChange(event: { page: number }) {
  page.value = event.page + 1;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// URL sync
watch([page, sort, filters], () => {
  const query: Record<string, string> = {};
  if (page.value > 1) query.page = String(page.value);
  if (sort.value !== 'newest') query.sort = sort.value;
  if (filters.value.brand_id) query.brand_id = filters.value.brand_id;
  if (filters.value.min_price) query.min_price = String(filters.value.min_price);
  if (filters.value.max_price) query.max_price = String(filters.value.max_price);
  router.replace({ query });
}, { deep: true });
</script>

<template>
  <div data-testid="products-page">
    <SEO :title="t('products.title')" />

    <div class="bg-white">
      <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-4">
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-500 mb-3">
        <router-link :to="{ name: 'home', params: { locale: locale() } }" class="hover:text-[#d32f2f]">
          Home
        </router-link>
        <span class="mx-1.5">›</span>
        <span class="text-gray-900 font-medium">{{ t('products.title') }}</span>
      </nav>

      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ t('products.title') }}</h1>
      <p v-if="totalItems > 0" class="text-sm text-gray-500 mb-4">
        <strong>1 – {{ Math.min(LIMIT, totalItems) }}</strong>
        {{ t('categories.products_of_total', { total: totalItems.toLocaleString('de-CH') }) }}
      </p>

      <div class="flex gap-6">
        <!-- Sidebar -->
        <div class="hidden lg:block w-[240px] shrink-0">
          <CategorySidebar />
        </div>

        <!-- Main content -->
        <div class="flex-1 min-w-0">
          <!-- Filter bar -->
          <ProductFilterBar :model-value="filters" @update:model-value="onFilterChange" />

          <!-- Active chips -->
          <div v-if="activeChips.length > 0" class="flex flex-wrap gap-1.5 mb-3">
            <span
              v-for="chip in activeChips"
              :key="chip.key"
              class="inline-flex items-center gap-1 bg-red-50 text-[#d32f2f] text-xs font-semibold px-2.5 py-1 rounded"
            >
              {{ chip.label }}
              <button class="hover:text-red-800" @click="clearFilter(chip.key)">
                <i class="pi pi-times text-[0.6rem]" />
              </button>
            </span>
            <button
              class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
              @click="clearAllFilters"
            >
              {{ t('categories.filters.reset') }}
            </button>
          </div>

          <!-- Sort + view controls -->
          <div class="mb-4">
            <ProductSort v-model="sort" v-model:view-mode="viewMode" />
          </div>

          <!-- Loading skeleton -->
          <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div v-for="i in 12" :key="i" class="border border-gray-100 rounded-lg p-3">
              <Skeleton height="160px" class="mb-3" />
              <Skeleton width="40%" class="mb-2" />
              <Skeleton width="80%" class="mb-2" />
              <Skeleton width="30%" />
            </div>
          </div>

          <!-- Error -->
          <EmptyState
            v-else-if="isError"
            icon="pi-exclamation-triangle"
            :title="t('common.errors.something_went_wrong')"
          />

          <!-- Empty -->
          <EmptyState
            v-else-if="products.length === 0"
            icon="pi-search"
            :title="t('categories.empty.title')"
            :subtitle="t('categories.empty.subtitle')"
          />

          <!-- Product grid/list -->
          <div
            v-else
            :class="viewMode === 'grid'
              ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3'
              : 'flex flex-col gap-3'"
          >
            <ProductCard
              v-for="product in products"
              :key="product._id"
              :product="product"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center mt-6">
            <Paginator
              :rows="LIMIT"
              :total-records="totalItems"
              :first="(page - 1) * LIMIT"
              @page="onPageChange"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
