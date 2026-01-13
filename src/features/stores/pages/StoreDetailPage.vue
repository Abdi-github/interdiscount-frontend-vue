<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import { useStore } from '../composables/useStores';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const locale = computed(() => (route.params.locale as string) || 'de');
const storeId = ref(route.params.id as string);

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

const { data: store, isLoading } = useStore(storeId);

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const todayIdx = new Date().getDay();
const todayKey = DAYS[todayIdx === 0 ? 6 : todayIdx - 1];
</script>

<template>
  <div data-testid="store-detail-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
    <div v-if="isLoading" class="py-12 text-center text-gray-400">
      <i class="pi pi-spin pi-spinner text-3xl" />
    </div>

    <template v-else-if="store">
      <button class="text-sm text-gray-500 hover:text-gray-700 mb-4" @click="router.push({ name: 'stores', params: { locale } })">
        <i class="pi pi-arrow-left mr-1 text-xs" /> {{ t('stores.title') }}
      </button>

      <div class="flex flex-wrap items-center gap-3 mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ store.name }}</h1>
        <span
          v-if="store.format === 'xxl'"
          class="text-sm font-bold px-3 py-1 rounded bg-[#d32f2f] text-white"
        >
          XXL
        </span>
        <span
          v-else
          class="text-sm px-3 py-1 rounded bg-gray-100 text-gray-600"
        >
          {{ t(`stores.formats.${store.format}`, store.format) }}
        </span>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Address & contact -->
        <section class="bg-white rounded-lg border p-6">
          <h2 class="text-sm font-semibold text-gray-700 mb-3">{{ t('stores.detail.address') }}</h2>
          <p class="text-sm text-gray-600 mb-4">
            {{ store.street }} {{ store.street_number }}<br />
            {{ store.postal_code }} {{ localizedName(store.city) }}<br />
            {{ localizedName(store.canton) }}
          </p>

          <div v-if="store.phone" class="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <i class="pi pi-phone text-[#d32f2f]" />
            <span>{{ store.phone }}</span>
          </div>
          <div v-if="store.email" class="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <i class="pi pi-envelope text-[#d32f2f]" />
            <span>{{ store.email }}</span>
          </div>

          <Button
            :label="t('stores.direction')"
            icon="pi pi-map"
            severity="danger"
            size="small"
            as="a"
            :href="`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`"
            target="_blank"
            rel="noopener noreferrer"
          />
        </section>

        <!-- Opening hours -->
        <section class="bg-white rounded-lg border p-6">
          <h2 class="text-sm font-semibold text-gray-700 mb-3">{{ t('stores.detail.hours') }}</h2>
          <div v-if="store.opening_hours" class="space-y-1.5">
            <div
              v-for="day in DAYS"
              :key="day"
              class="flex justify-between text-sm py-1 px-2 rounded"
              :class="day === todayKey ? 'bg-orange-50 font-semibold' : ''"
            >
              <span class="text-gray-700">{{ t(`stores.days.${day}`) }}</span>
              <span v-if="store.opening_hours[day]" class="text-gray-600">
                {{ store.opening_hours[day]!.open }} – {{ store.opening_hours[day]!.close }}
              </span>
              <span v-else class="text-gray-400 italic">{{ t('stores.closed') }}</span>
            </div>
          </div>
        </section>
      </div>
    </template>

    <p v-else class="text-gray-500">Store not found.</p>
  </div>
  </div>
</template>
