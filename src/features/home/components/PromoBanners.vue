<script setup lang="ts">
import { useRoute } from 'vue-router';

interface PromoBanner {
  image: string;
  badge: string;
  title: string;
  href: string;
}

const route = useRoute();
const locale = () => (route.params.locale as string) || 'de';

const PROMO_BANNERS: PromoBanner[] = [
  {
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=340&fit=crop',
    badge: 'Bis zu 45%',
    title: 'Rabatt auf ausgewählte Produkte von APPLE',
    href: '/search?brand=Apple',
  },
  {
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=340&fit=crop',
    badge: 'AKTION',
    title: 'Best of SAMSUNG - Top Preise auf ausgewählte TV, Soundbar und Tablets',
    href: '/search?brand=Samsung',
  },
  {
    image: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600&h=340&fit=crop',
    badge: '10%',
    title: 'Mac mini. Sieht klein aus. Kommt gross raus.',
    href: '/search?q=mac+mini',
  },
  {
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=340&fit=crop',
    badge: 'Bis zu 20%',
    title: 'Rabatt auf ausgewählte Kaffeemaschinen',
    href: '/search?q=kaffeemaschine',
  },
  {
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=340&fit=crop',
    badge: 'NEW',
    title: 'SAMSUNG Galaxy S26 Series - Jetzt kaufen!',
    href: '/search?q=samsung+galaxy+s26',
  },
  {
    image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600&h=340&fit=crop',
    badge: 'TIPP',
    title: 'Die neuesten Laptops im Vergleich',
    href: '/search?q=laptop',
  },
];
</script>

<template>
  <div data-testid="promo-banners" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
    <router-link
      v-for="(banner, i) in PROMO_BANNERS"
      :key="i"
      :to="`/${locale()}${banner.href}`"
      class="group relative rounded-lg overflow-hidden aspect-[16/9] no-underline block"
    >
      <img
        :src="banner.image"
        :alt="banner.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div class="absolute top-3 left-3">
        <span class="bg-[#d32f2f] text-white text-[0.7rem] font-bold uppercase px-2.5 py-1 rounded">
          {{ banner.badge }}
        </span>
      </div>
      <div class="absolute bottom-3 left-3 right-3">
        <p class="text-white text-[0.85rem] font-semibold leading-snug m-0 drop-shadow-md">
          {{ banner.title }}
        </p>
      </div>
    </router-link>
  </div>
</template>
