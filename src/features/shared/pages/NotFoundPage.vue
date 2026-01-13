<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';

const { t } = useI18n();
const route = useRoute();

const locale = () => {
  const pathLocale = route.path.split('/')[1];
  const supported = ['de', 'en', 'fr', 'it'];
  return supported.includes(pathLocale) ? pathLocale : 'de';
};
</script>

<template>
  <div data-testid="not-found-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6">
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 class="text-8xl font-bold text-gray-200 mb-4">404</h1>
    <h2 class="text-2xl font-semibold text-gray-900 mb-2">{{ t('common.errors.page_not_found') }}</h2>
    <p class="text-gray-500 mb-8 max-w-md">{{ t('common.errors.page_not_found_desc') }}</p>
    <div class="flex flex-col sm:flex-row gap-3">
      <router-link :to="{ name: 'home', params: { locale: locale() } }">
        <Button :label="t('common.errors.back_home')" severity="danger" />
      </router-link>
      <router-link :to="{ name: 'products', params: { locale: locale() } }">
        <Button :label="t('common.nav.products')" severity="secondary" outlined />
      </router-link>
    </div>
  </div>
  </div>
  </div>
</template>
