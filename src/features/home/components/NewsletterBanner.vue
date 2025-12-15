<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const locale = () => (route.params.locale as string) || 'de';
</script>

<template>
  <section class="bg-[#d32f2f]" data-testid="newsletter-banner">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-6 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h3 class="text-lg font-bold text-white m-0">
          {{ t('home.newsletter.title') }}
        </h3>
        <p class="text-sm text-white/80 mt-1 max-w-[520px] m-0">
          {{ t('home.newsletter.description') }}
        </p>
      </div>
      <router-link
        :to="{ name: 'contact', params: { locale: locale() } }"
        class="bg-white text-[#d32f2f] font-bold text-sm px-6 py-2.5 rounded hover:bg-gray-100 transition-colors no-underline flex items-center gap-2 shrink-0"
      >
        {{ t('home.newsletter.cta') }}
        <i class="pi pi-arrow-right text-sm" />
      </router-link>
    </div>
  </section>
</template>
