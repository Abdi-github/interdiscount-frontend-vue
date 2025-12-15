<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

interface ThemeCard {
  emoji: string;
  key: string;
  href: string;
}

const { t } = useI18n();
const route = useRoute();
const locale = () => (route.params.locale as string) || 'de';

const THEME_CARDS: ThemeCard[] = [
  { emoji: '✨', key: 'new_arrivals', href: '/search?sort=newest' },
  { emoji: '🎮', key: 'gaming', href: '/categories/ordinateurs-et-jeux' },
  { emoji: '🧹', key: 'spring_cleaning', href: '/search?q=staubsauger' },
  { emoji: '👶', key: 'baby_family', href: '/categories/beaute-bebe-sante' },
  { emoji: '📷', key: 'photo_video', href: '/categories/photo-et-video' },
  { emoji: '🔌', key: 'gadgets', href: '/search?q=gadget' },
];
</script>

<template>
  <section class="py-2" data-testid="theme-worlds">
    <h2 class="text-xl font-bold text-gray-900 mb-4">
      {{ t('home.themes.heading') }}
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      <router-link
        v-for="card in THEME_CARDS"
        :key="card.key"
        :to="`/${locale()}${card.href}`"
        class="flex flex-col items-center gap-2 px-4 py-4 rounded-lg border border-gray-200 bg-white hover:border-[#d32f2f] hover:shadow-sm transition-all no-underline text-center"
      >
        <span class="text-2xl">{{ card.emoji }}</span>
        <p class="text-[0.82rem] font-semibold text-gray-900 m-0">
          {{ t(`home.themes.${card.key}`) }}
        </p>
        <p class="text-[0.7rem] text-gray-500 m-0 leading-snug">
          {{ t(`home.themes.${card.key}_desc`) }}
        </p>
      </router-link>
    </div>
  </section>
</template>
