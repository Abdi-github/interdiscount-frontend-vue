<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const locale = () => (route.params.locale as string) || 'de';
</script>

<template>
  <div data-testid="filial-card" class="p-4 rounded-lg border border-gray-200 bg-white">
    <h4 class="text-sm font-bold text-gray-900 m-0 flex items-center gap-2">
      <i class="pi pi-shop text-[#d32f2f]" />
      {{ t('home.store_finder.title') }}
    </h4>
    <p class="text-[0.75rem] text-gray-500 mt-2 mb-0 leading-relaxed">
      {{ t('home.store_finder.subtitle') }}
    </p>
    <p class="text-[0.75rem] text-gray-500 mt-0.5 mb-3">
      {{ t('home.store_finder.description') }}
    </p>
    <router-link
      :to="{ name: 'stores', params: { locale: locale() } }"
      class="flex items-center justify-center gap-2 w-full bg-[#d32f2f] text-white font-semibold text-[0.8rem] py-2.5 rounded hover:bg-[#b71c1c] transition-colors no-underline"
    >
      <i class="pi pi-map-marker text-sm" />
      {{ t('home.store_finder.button') }}
    </router-link>
  </div>
</template>
