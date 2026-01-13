<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Skeleton from 'primevue/skeleton';
import { useStores } from '../composables/useStores';
import type { StoreFilters, Store } from '../types';
import EmptyState from '@/shared/components/ui/EmptyState.vue';

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'de');

function localizedName(val: unknown): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null) {
    const obj = val as Record<string, unknown>;
    if (obj.name && typeof obj.name === 'object') {
      return (obj.name as Record<string, string>)[locale.value] ?? (obj.name as Record<string, string>).de ?? '';
    }
    if (typeof obj[locale.value] === 'string') return obj[locale.value] as string;
    if (typeof obj.de === 'string') return obj.de;
  }
  return String(val);
}

const search = ref('');
const cantonFilter = ref('');
const formatFilter = ref('');

const params = computed<StoreFilters>(() => ({
  search: search.value || undefined,
  canton_id: cantonFilter.value || undefined,
  format: formatFilter.value || undefined,
  limit: 200,
}));

const { data: storesData, isLoading } = useStores(params);
const stores = computed(() => storesData.value?.data ?? []);

// Extract unique cantons from stores
const cantonOptions = computed(() => {
  const cantons = new Map<string, string>();
  for (const s of stores.value) {
    if (s.canton_id && s.canton) cantons.set(s.canton_id, localizedName(s.canton));
  }
  return [{ label: t('stores.all_cantons'), value: '' }, ...Array.from(cantons, ([value, label]) => ({ label, value }))];
});

const formatOptions = [
  { label: 'Alle', value: '' },
  { label: 'Standard', value: 'standard' },
  { label: 'XXL', value: 'xxl' },
  { label: 'Compact', value: 'compact' },
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function getTodayHours(store: Store): string {
  const dayIdx = new Date().getDay();
  const dayKey = DAYS[dayIdx === 0 ? 6 : dayIdx - 1];
  const hours = store.opening_hours?.[dayKey];
  if (!hours) return t('stores.closed');
  return `${hours.open} – ${hours.close}`;
}
</script>

<template>
  <div data-testid="stores-list-page">
    <div class="bg-white">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ t('stores.title') }}</h1>
    <p class="text-sm text-gray-500 mb-6">{{ t('stores.subtitle') }}</p>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <div class="relative flex-1 min-w-[200px]">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <InputText
          v-model="search"
          :placeholder="t('stores.search')"
          class="w-full pl-9"
        />
      </div>
      <Select
        v-model="cantonFilter"
        :options="cantonOptions"
        optionLabel="label"
        optionValue="value"
        :placeholder="t('stores.filter_canton')"
        class="w-48"
      />
      <Select
        v-model="formatFilter"
        :options="formatOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Format"
        class="w-40"
      />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="n in 6" :key="n" class="border border-gray-200 rounded-lg p-5">
        <Skeleton width="60%" height="20px" class="mb-3" />
        <Skeleton width="80%" height="14px" class="mb-1" />
        <Skeleton width="50%" height="14px" class="mb-3" />
        <Skeleton width="40%" height="12px" />
      </div>
    </div>

    <!-- Stores grid -->
    <div v-else-if="stores.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link
        v-for="store in stores"
        :key="store._id"
        :to="{ name: 'store-detail', params: { locale, id: store._id } }"
        :data-testid="`store-card-${store._id}`"
        class="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow no-underline group"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-base font-semibold text-gray-900 group-hover:text-[#d32f2f]">{{ store.name }}</h3>
          <span
            v-if="store.format === 'xxl'"
            class="text-xs font-bold px-2 py-0.5 rounded bg-[#d32f2f] text-white"
          >
            XXL
          </span>
        </div>
        <p class="text-sm text-gray-600 mb-1">
          {{ store.street }} {{ store.street_number }}
        </p>
        <p class="text-sm text-gray-600 mb-2">
          {{ store.postal_code }} {{ localizedName(store.city) }}
        </p>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <i class="pi pi-clock" />
          <span>{{ t('stores.today') }}: {{ getTodayHours(store) }}</span>
        </div>
        <div v-if="store.phone" class="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <i class="pi pi-phone" />
          <span>{{ store.phone }}</span>
        </div>
      </router-link>
    </div>

    <EmptyState
      v-else
      icon="pi-map-marker"
      :title="t('stores.empty')"
    />
    </div>
    </div>
  </div>
</template>
