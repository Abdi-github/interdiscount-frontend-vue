<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const locale = () => (route.params.locale as string) || 'de';

const BRANDS = ['Apple', 'Samsung', 'Sony', 'Philips', 'LG', 'Bosch', 'Dyson', 'Garmin'];
</script>

<template>
  <section class="py-6" data-testid="brand-showcase">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">
        {{ t('home.sections.brands') }}
      </h2>
      <div class="grid grid-cols-4 md:grid-cols-8 gap-3">
        <router-link
          v-for="brand in BRANDS"
          :key="brand"
          :to="`/${locale()}/search?brand=${brand}`"
          class="flex items-center justify-center px-3 py-4 border border-gray-200 rounded-lg text-gray-600 font-semibold text-sm hover:border-[#d32f2f] hover:text-[#d32f2f] transition-all no-underline bg-white"
        >
          {{ brand }}
        </router-link>
      </div>
    </div>
  </section>
</template>
