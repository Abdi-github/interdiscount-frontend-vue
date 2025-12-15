<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useFeaturedProducts, useTopDeals, useNewArrivals } from '../composables/useHome';
import SEO from '@/shared/components/SEO.vue';
import CategorySidebar from '@/features/categories/components/CategorySidebar.vue';
import PromoBanners from '../components/PromoBanners.vue';
import FeaturedProducts from '../components/FeaturedProducts.vue';
import Themenwelten from '../components/Themenwelten.vue';
import NewsletterBanner from '../components/NewsletterBanner.vue';
import ServicesStrip from '../components/ServicesStrip.vue';
import BrandShowcase from '../components/BrandShowcase.vue';
import FilialCard from '../components/FilialCard.vue';

const { t } = useI18n();

const { data: featured, isLoading: featuredLoading } = useFeaturedProducts();
const { data: topDeals, isLoading: dealsLoading } = useTopDeals();
const { data: newArrivals, isLoading: arrivalsLoading } = useNewArrivals();
</script>

<template>
  <div data-testid="home-page">
    <SEO :title="t('home.hero.default_title')" :description="t('home.hero.default_subtitle')" />

    <!-- Main content: sidebar + promo banners -->
    <div class="bg-white">
      <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-6">
        <div class="flex gap-6 items-start">
          <!-- Left category sidebar + store finder (desktop only) -->
          <div class="hidden lg:block w-[220px] shrink-0 space-y-4 sticky top-[120px]">
            <CategorySidebar />
            <FilialCard />
          </div>

          <!-- Promo banners -->
          <div class="flex-1 min-w-0">
            <PromoBanners />
          </div>
        </div>
      </div>
    </div>

    <!-- Featured products -->
    <div class="bg-white border-t border-gray-100">
      <FeaturedProducts
        :products="featured?.data ?? []"
        :loading="featuredLoading"
        title-key="home.sections.featured"
      />
    </div>

    <!-- Theme worlds -->
    <div class="bg-white border-t border-gray-100">
      <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-6">
        <Themenwelten />
      </div>
    </div>

    <!-- Top deals -->
    <div class="bg-white border-t border-gray-100">
      <FeaturedProducts
        :products="topDeals?.data ?? []"
        :loading="dealsLoading"
        title-key="home.sections.top_deals"
      />
    </div>

    <!-- New arrivals -->
    <div class="bg-white border-t border-gray-100">
      <FeaturedProducts
        :products="newArrivals?.data ?? []"
        :loading="arrivalsLoading"
        title-key="home.sections.new_arrivals"
      />
    </div>

    <!-- About section -->
    <div class="bg-white border-t border-gray-100">
      <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
        <h2 class="text-xl font-bold text-gray-900 mb-3">
          {{ t('home.about.title') }}
        </h2>
        <p class="text-sm text-gray-600 leading-relaxed max-w-[900px]">
          {{ t('home.about.description') }}
        </p>
      </div>
    </div>

    <!-- Newsletter -->
    <div class="border-t border-gray-100">
      <NewsletterBanner />
    </div>

    <!-- Services -->
    <div class="bg-white border-t border-gray-100">
      <ServicesStrip />
    </div>

    <!-- Brands -->
    <div class="bg-white border-t border-gray-100">
      <BrandShowcase />
    </div>
  </div>
</template>
