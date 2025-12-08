<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useCategories } from '@/features/categories/composables/useCategories';
import { useLocalizedName } from '@/shared/composables/useLocalizedName';
import type { Category } from '@/features/categories/types';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const localizedName = useLocalizedName();

const locale = () => (route.params.locale as string) || 'de';

const { data: allCategories } = useCategories();

const rootCategories = computed(() => {
  if (!allCategories.value) return [];
  return (allCategories.value as Category[])
    .filter((c) => !c.parent_id);
});

interface NavItem {
  key: string;
  hasMega?: boolean;
  route?: string;
  badge?: string;
}

const TOP_NAV: NavItem[] = [
  { key: 'sortiment', hasMega: true },
  { key: 'aktionen', route: 'aktionen', badge: '9+' },
  { key: 'service', route: 'service' },
  { key: 'support', route: 'support' },
  { key: 'unternehmen', route: 'unternehmen' },
];

const megaOpen = ref(false);
const megaAnchor = ref<HTMLElement | null>(null);

function openMega(e: MouseEvent) {
  megaAnchor.value = e.currentTarget as HTMLElement;
  megaOpen.value = true;
}

function closeMega() {
  megaOpen.value = false;
  megaAnchor.value = null;
}

function isActive(navKey: string) {
  if (navKey === 'sortiment') return false;
  return route.name === navKey;
}

function navigateCategory(slug: string) {
  closeMega();
  router.push({ name: 'category', params: { locale: locale(), slug } });
}

function navigateAllCategories() {
  closeMega();
  router.push({ name: 'search', params: { locale: locale() } });
}
</script>

<template>
  <nav data-testid="category-nav" class="bg-white border-b border-gray-200 hidden md:block">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-6">
      <div class="flex items-stretch">
        <template v-for="item in TOP_NAV" :key="item.key">
          <!-- Sortiment with mega-menu -->
          <div v-if="item.hasMega" class="relative">
            <button
              class="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-gray-800 border-b-2 border-transparent hover:text-[#d32f2f] hover:border-[#d32f2f] transition-colors"
              @click="openMega"
              @mouseenter="openMega"
            >
              {{ t(`common.nav.${item.key}`) }}
              <i class="pi pi-chevron-down text-[0.6rem]" />
            </button>

            <!-- Mega-menu dropdown -->
            <div
              v-if="megaOpen"
              class="absolute top-full left-0 z-50 w-64 bg-white border border-gray-200 rounded-b-lg shadow-xl"
              @mouseleave="closeMega"
            >
              <div class="py-2">
                <button
                  v-for="cat in rootCategories"
                  :key="cat._id"
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d32f2f] transition-colors"
                  @click="navigateCategory(cat.slug)"
                >
                  {{ localizedName(cat.name) }}
                </button>
                <div class="border-t border-gray-100 mt-1 pt-1 px-2">
                  <button
                    class="w-full text-left px-2 py-2 text-sm rounded text-[#d32f2f] font-semibold hover:bg-red-50 transition-colors"
                    @click="navigateAllCategories"
                  >
                    {{ t('common.nav.all_categories') }} →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Regular nav links -->
          <router-link
            v-else
            :to="{ name: item.route, params: { locale: locale() } }"
            class="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors"
            :class="isActive(item.key) ?
              'text-[#d32f2f] border-[#d32f2f]' :
              'text-gray-800 border-transparent hover:text-[#d32f2f] hover:border-[#d32f2f]'"
          >
            {{ t(`common.nav.${item.key}`) }}
            <span
              v-if="'badge' in item && item.badge"
              class="bg-[#d32f2f] text-white text-[0.6rem] font-bold rounded-full px-1.5 py-0.5 leading-none"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>
