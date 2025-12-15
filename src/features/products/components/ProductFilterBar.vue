<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useBrands } from '@/features/brands/composables/useBrands';
import type { Brand } from '@/features/products/types';

export interface FilterValues {
  brand_id?: string;
  min_price?: number;
  max_price?: number;
  on_sale?: boolean;
  sustainable?: boolean;
  speed?: string;
}

const props = defineProps<{
  modelValue: FilterValues;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: FilterValues];
}>();

const { t } = useI18n();
const { data: brands } = useBrands();

const brandSearch = ref('');
const showBrands = ref(false);
const showPrice = ref(false);

const filteredBrands = computed(() => {
  if (!brands.value) return [];
  const list = brands.value as Brand[];
  if (!brandSearch.value) return list.slice(0, 20);
  const q = brandSearch.value.toLowerCase();
  return list.filter((b) => b.name.toLowerCase().includes(q));
});

const selectedBrand = computed(() => {
  if (!props.modelValue.brand_id || !brands.value) return null;
  return (brands.value as Brand[]).find((b) => b._id === props.modelValue.brand_id) ?? null;
});

const minPrice = ref(props.modelValue.min_price?.toString() ?? '');
const maxPrice = ref(props.modelValue.max_price?.toString() ?? '');

watch(() => props.modelValue, (v) => {
  minPrice.value = v.min_price?.toString() ?? '';
  maxPrice.value = v.max_price?.toString() ?? '';
}, { deep: true });

function update(partial: Partial<FilterValues>) {
  emit('update:modelValue', { ...props.modelValue, ...partial });
}

function selectBrand(id: string) {
  update({ brand_id: id });
  showBrands.value = false;
  brandSearch.value = '';
}

function clearBrand() {
  const next = { ...props.modelValue };
  delete next.brand_id;
  emit('update:modelValue', next);
}

function applyPrice() {
  update({
    min_price: minPrice.value ? Number(minPrice.value) : undefined,
    max_price: maxPrice.value ? Number(maxPrice.value) : undefined,
  });
  showPrice.value = false;
}

function toggleFlag(key: 'on_sale' | 'sustainable') {
  const next = { ...props.modelValue };
  if (next[key]) {
    delete next[key];
  } else {
    next[key] = true;
  }
  emit('update:modelValue', next);
}
</script>

<template>
  <div data-testid="product-filter-bar" class="flex flex-wrap items-center gap-2 mb-3">
    <!-- Brand filter -->
    <div class="relative">
      <button
        data-testid="filter-brand"
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md transition-colors"
        :class="modelValue.brand_id
          ? 'border-[#d32f2f] bg-[#d32f2f]/5 text-[#d32f2f] font-semibold'
          : 'border-gray-300 text-gray-700 hover:border-gray-400'"
        @click="showBrands = !showBrands"
      >
        <i class="pi pi-tag text-xs" />
        {{ selectedBrand ? selectedBrand.name : t('categories.filters.brands') }}
        <i class="pi pi-chevron-down text-[0.6rem]" />
      </button>

      <div
        v-if="showBrands"
        class="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-56 max-h-64 overflow-hidden"
      >
        <div class="p-2 border-b border-gray-100">
          <input
            v-model="brandSearch"
            type="text"
            :placeholder="t('categories.filters.search_brand')"
            class="w-full border border-gray-200 rounded px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#d32f2f]"
          />
        </div>
        <div class="overflow-y-auto max-h-48">
          <button
            v-for="brand in filteredBrands"
            :key="brand._id"
            class="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
            :class="{ 'bg-[#d32f2f]/5 font-semibold text-[#d32f2f]': brand._id === modelValue.brand_id }"
            @click="selectBrand(brand._id)"
          >
            {{ brand.name }}
          </button>
          <p v-if="filteredBrands.length === 0" class="px-3 py-2 text-sm text-gray-400">
            {{ t('categories.filters.no_brands') }}
          </p>
        </div>
        <div v-if="modelValue.brand_id" class="border-t border-gray-100 p-1.5">
          <button class="w-full text-center text-xs text-gray-500 hover:text-red-500" @click="clearBrand">
            {{ t('categories.filters.reset') }}
          </button>
        </div>
      </div>
      <div v-if="showBrands" class="fixed inset-0 z-40" @click="showBrands = false" />
    </div>

    <!-- Price filter -->
    <div class="relative">
      <button
        data-testid="filter-price"
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md transition-colors"
        :class="(modelValue.min_price || modelValue.max_price)
          ? 'border-[#d32f2f] bg-[#d32f2f]/5 text-[#d32f2f] font-semibold'
          : 'border-gray-300 text-gray-700 hover:border-gray-400'"
        @click="showPrice = !showPrice"
      >
        {{ t('categories.filters.price') }}
        <i class="pi pi-chevron-down text-[0.6rem]" />
      </button>

      <div
        v-if="showPrice"
        class="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-56 p-3"
      >
        <p class="text-xs font-semibold text-gray-500 mb-2">{{ t('categories.filters.price_range') }}</p>
        <div class="flex items-center gap-2 mb-3">
          <input
            v-model="minPrice"
            data-testid="filter-price-min"
            type="number"
            :placeholder="t('categories.filters.price_from')"
            class="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#d32f2f]"
          />
          <span class="text-gray-400">–</span>
          <input
            v-model="maxPrice"
            data-testid="filter-price-max"
            type="number"
            :placeholder="t('categories.filters.price_to')"
            class="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#d32f2f]"
          />
        </div>
        <button
          class="w-full bg-[#d32f2f] text-white text-sm font-semibold rounded py-1.5 hover:bg-[#b71c1c] transition-colors"
          @click="applyPrice"
        >
          {{ t('categories.filters.apply') }}
        </button>
      </div>
      <div v-if="showPrice" class="fixed inset-0 z-40" @click="showPrice = false" />
    </div>

    <!-- Offer toggle -->
    <button
      class="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md transition-colors"
      :class="modelValue.on_sale
        ? 'border-[#d32f2f] bg-[#d32f2f]/5 text-[#d32f2f] font-semibold'
        : 'border-gray-300 text-gray-700 hover:border-gray-400'"
      @click="toggleFlag('on_sale')"
    >
      {{ t('categories.filters.promotions') }}
    </button>

    <!-- Sustainable toggle -->
    <button
      class="flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-md transition-colors"
      :class="modelValue.sustainable
        ? 'border-[#d32f2f] bg-[#d32f2f]/5 text-[#d32f2f] font-semibold'
        : 'border-gray-300 text-gray-700 hover:border-gray-400'"
      @click="toggleFlag('sustainable')"
    >
      {{ t('categories.filters.sustainable') }}
    </button>
  </div>
</template>
