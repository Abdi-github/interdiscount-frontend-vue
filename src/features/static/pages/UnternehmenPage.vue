<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const cards = [
  { key: 'press', icon: 'pi-megaphone' },
  { key: 'jobs', icon: 'pi-briefcase' },
  { key: 'sustainability', icon: 'pi-globe' },
  { key: 'sponsoring', icon: 'pi-heart' },
  { key: 'education', icon: 'pi-graduation-cap' },
  { key: 'advertising', icon: 'pi-bullseye' },
];

const sidebarItems = [
  'about', 'sustainability', 'press', 'jobs', 'prospekt', 'sponsoring', 'business', 'terms', 'imprint', 'privacy',
];
</script>

<template>
  <div data-testid="about-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar -->
      <aside class="lg:w-56 shrink-0">
        <h2 class="font-bold text-lg mb-3">{{ t('common.pages.unternehmen.sidebar_company') }}</h2>
        <nav class="space-y-1">
          <div
            v-for="item in sidebarItems"
            :key="item"
            class="px-3 py-2 text-sm text-gray-700 hover:text-[#d32f2f] hover:bg-gray-50 rounded cursor-pointer transition-colors"
          >
            {{ t(`common.pages.unternehmen.sidebar_${item}`) }}
          </div>
        </nav>
      </aside>

      <!-- Content -->
      <div class="flex-1">
        <h1 class="text-3xl font-bold mb-4">{{ t('common.pages.unternehmen.title') }}</h1>
        <p class="text-gray-600 leading-relaxed mb-8 max-w-3xl">
          {{ t('common.pages.unternehmen.description') }}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="card in cards"
            :key="card.key"
            class="border border-gray-200 rounded-lg p-6 hover:border-[#d32f2f] hover:shadow-sm transition-all cursor-pointer"
          >
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <i :class="['pi', card.icon, 'text-[#d32f2f]']" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ t(`common.pages.unternehmen.card_${card.key}`) }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ t(`common.pages.unternehmen.card_${card.key}_desc`) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
