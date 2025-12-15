<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Skeleton from 'primevue/skeleton';
import { useBrands } from '../composables/useBrands';
import type { Brand } from '../types';

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'de');
const { data: brands, isLoading } = useBrands();

const brandsList = computed(() => (brands.value as Brand[]) ?? []);

const grouped = computed(() => {
  const map = new Map<string, Brand[]>();
  for (const brand of brandsList.value) {
    const letter = (brand.name?.[0] ?? '#').toUpperCase();
    if (!map.has(letter)) map.set(letter, []);
    map.get(letter)!.push(brand);
  }
  return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
});
</script>

<template>
  <div data-testid="brands-page" class="bg-white">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ t('common.brands.title') }}</h1>

      <!-- Loading -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Skeleton v-for="i in 18" :key="i" height="48px" class="rounded-lg" />
      </div>

      <!-- Brands grouped by letter -->
      <div v-else-if="grouped.length > 0" class="space-y-8">
        <section v-for="[letter, letterBrands] in grouped" :key="letter">
          <h2 class="text-lg font-bold text-[#d32f2f] border-b border-gray-200 pb-1 mb-3">{{ letter }}</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <router-link
              v-for="brand in letterBrands"
              :key="brand._id"
              :to="{ name: 'products', params: { locale }, query: { brand_id: brand._id } }"
              class="text-sm text-gray-700 hover:text-[#d32f2f] px-3 py-2 rounded border border-gray-100 hover:border-[#d32f2f] transition-colors no-underline"
            >
              {{ brand.name }}
              <span v-if="brand.product_count" class="text-xs text-gray-400 ml-1">({{ brand.product_count }})</span>
            </router-link>
          </div>
        </section>
      </div>

      <div v-else class="text-center py-16 text-gray-500">
        <i class="pi pi-tag text-4xl mb-3 block" />
        <p>{{ t('common.no_results') }}</p>
      </div>
    </div>
  </div>
</template>
