<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const sections = [1, 2, 3, 4, 5];
</script>

<template>
  <div data-testid="privacy-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
  <div class="max-w-3xl">
    <h1 class="text-3xl font-bold mb-8">{{ t('common.footer.privacy') }}</h1>

    <div class="space-y-8">
      <section v-for="n in sections" :key="n">
        <h2 class="text-lg font-semibold text-gray-800 mb-3">{{ t(`common.privacy.section${n}_title`) }}</h2>
        <p class="text-gray-600 leading-relaxed">{{ t(`common.privacy.section${n}_content`) }}</p>
      </section>
    </div>

    <p class="mt-8 text-sm text-gray-400 italic">{{ t('common.privacy.disclaimer') }}</p>
  </div>
  </div>
  </div>
</template>
