<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useCategories } from '@/features/categories/composables/useCategories';
import { useLocalizedName } from '@/shared/composables/useLocalizedName';
import { useLanguageStore } from '@/stores/language.store';
import type { Category } from '@/features/categories/types';
import type { SupportedLocale } from '@/shared/utils/constants';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const languageStore = useLanguageStore();
const localizedName = useLocalizedName();

const currentLocale = () => (route.params.locale as string) || 'de';

const { data: allCategories } = useCategories();

const rootCategories = computed(() => {
  if (!allCategories.value) return [];
  return (allCategories.value as Category[])
    .filter((c) => !c.parent_id);
});

const year = new Date().getFullYear();

const LANGUAGES: { code: SupportedLocale; label: string }[] = [
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'en', label: 'English' },
];

const SERVICE_LINKS = [
  { key: 'service_overview', route: 'service' },
  { key: 'pc_service', route: 'service' },
  { key: 'mobile_service', route: 'service' },
  { key: 'garantie_plus', route: 'service' },
  { key: 'cewe', route: 'service' },
  { key: 'trade_in', route: 'service' },
];

const SUPPORT_LINKS = [
  { key: 'support_overview', route: 'support' },
  { key: 'helpcenter', route: 'support' },
  { key: 'contact_us', route: 'contact' },
  { key: 'shipping_delivery', route: 'support' },
  { key: 'repairs', route: 'support' },
  { key: 'returns_label', route: 'support' },
  { key: 'order_documents', route: 'orders' },
];

const COMPANY_LINKS = [
  { key: 'company_overview', route: 'unternehmen' },
  { key: 'about_interdiscount', route: 'unternehmen' },
  { key: 'sustainability', route: 'unternehmen' },
  { key: 'press', route: 'unternehmen' },
  { key: 'jobs', route: 'unternehmen' },
  { key: 'prospekt', route: 'unternehmen' },
  { key: 'business_customers', route: 'unternehmen' },
];

const PAYMENT_LABELS = [
  'VISA', 'Mastercard', 'AMEX', 'TWINT', 'PostFinance',
];

const SOCIAL_LINKS = [
  { icon: 'pi-facebook', label: 'Facebook' },
  { icon: 'pi-instagram', label: 'Instagram' },
  { icon: 'pi-linkedin', label: 'LinkedIn' },
  { icon: 'pi-youtube', label: 'YouTube' },
];

function switchLanguage(code: string) {
  locale.value = code;
  languageStore.setLocale(code);
  router.replace({ path: route.path.replace(/^\/[a-z]{2}/, `/${code}`) });
}
</script>

<template>
  <footer data-testid="footer" class="mt-auto">
    <!-- Benefits bar (like real interdiscount.ch "Einkaufen wie es dir gefällt") -->
    <div class="bg-white border-t border-gray-200">
      <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-5">
        <h3 class="text-base font-bold text-gray-900 mb-3">{{ t('common.footer.benefits_title') }}</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="flex items-center gap-3 text-sm">
            <i class="pi pi-shop text-[#d32f2f] text-xl" />
            <span class="text-gray-700 font-medium">{{ t('common.footer.benefit_pickup') }}</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <i class="pi pi-truck text-[#d32f2f] text-xl" />
            <span class="text-gray-700 font-medium">{{ t('common.footer.benefit_delivery') }}</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <i class="pi pi-verified text-[#d32f2f] text-xl" />
            <span class="text-gray-700 font-medium">{{ t('common.footer.benefit_guarantee') }}</span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <i class="pi pi-credit-card text-[#d32f2f] text-xl" />
            <span class="text-gray-700 font-medium">{{ t('common.footer.benefit_payment') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main dark footer -->
    <div class="bg-[#1a1a1a] text-gray-400">
      <!-- Logo bar -->
      <div class="border-b border-[#2a2a2a]">
        <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-4 flex items-center gap-4 flex-wrap">
          <!-- Logo -->
          <div class="flex items-center gap-1.5">
            <span class="bg-[#d32f2f] text-white w-8 h-8 rounded-[6px] flex items-center justify-center font-black text-lg leading-none shrink-0">
              i
            </span>
            <span class="flex flex-col leading-none">
              <span class="font-extrabold text-white text-[0.85rem] leading-[1.1]">Inter</span>
              <span class="font-extrabold text-white text-[0.85rem] leading-[1.1]">Discount</span>
            </span>
          </div>

          <router-link
            :to="{ name: 'stores', params: { locale: currentLocale() } }"
            class="border border-gray-600 text-gray-300 hover:border-white hover:text-white rounded px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors no-underline"
          >
            <i class="pi pi-shop text-sm" />
            {{ t('common.nav.find_store') }}
          </router-link>

          <router-link
            :to="{ name: 'contact', params: { locale: currentLocale() } }"
            class="border border-gray-600 text-gray-300 hover:border-white hover:text-white rounded px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors no-underline"
          >
            <i class="pi pi-question-circle text-sm" />
            {{ t('common.nav.helpcenter') }}
          </router-link>
        </div>
      </div>

      <!-- Link columns -->
      <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-10">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <!-- Sortiment (from API) -->
          <div>
            <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {{ t('common.footer.sortiment') }}
            </h4>
            <ul class="space-y-2 list-none m-0 p-0">
              <li v-for="cat in rootCategories" :key="cat._id">
                <router-link
                  :to="{ name: 'category', params: { locale: currentLocale(), slug: cat.slug } }"
                  class="text-[0.82rem] hover:text-white transition-colors no-underline text-gray-400"
                >
                  {{ localizedName(cat.name) }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Service -->
          <div>
            <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {{ t('common.footer.service') }}
            </h4>
            <ul class="space-y-2 list-none m-0 p-0">
              <li v-for="link in SERVICE_LINKS" :key="link.key">
                <router-link
                  :to="{ name: link.route, params: { locale: currentLocale() } }"
                  class="text-[0.82rem] hover:text-white transition-colors no-underline text-gray-400"
                >
                  {{ t(`common.footer.${link.key}`) }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {{ t('common.footer.support') }}
            </h4>
            <ul class="space-y-2 list-none m-0 p-0">
              <li v-for="link in SUPPORT_LINKS" :key="link.key">
                <router-link
                  :to="{ name: link.route, params: { locale: currentLocale() } }"
                  class="text-[0.82rem] hover:text-white transition-colors no-underline text-gray-400"
                >
                  {{ t(`common.footer.${link.key}`) }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Company -->
          <div>
            <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {{ t('common.footer.company') }}
            </h4>
            <ul class="space-y-2 list-none m-0 p-0">
              <li v-for="link in COMPANY_LINKS" :key="link.key">
                <router-link
                  :to="{ name: link.route, params: { locale: currentLocale() } }"
                  class="text-[0.82rem] hover:text-white transition-colors no-underline text-gray-400"
                >
                  {{ t(`common.footer.${link.key}`) }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Social -->
          <div>
            <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {{ t('common.footer.follow_us') }}
            </h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="social in SOCIAL_LINKS"
                :key="social.label"
                class="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#d32f2f] cursor-pointer transition-colors"
                :title="social.label"
              >
                <i :class="['pi', social.icon, 'text-sm']" />
              </span>
            </div>
          </div>

          <!-- Payment methods -->
          <div>
            <h4 class="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {{ t('common.footer.payment_methods') }}
            </h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="method in PAYMENT_LABELS"
                :key="method"
                class="bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2.5 py-1 text-[0.7rem] font-medium text-gray-300"
              >
                {{ method }}
              </span>
              <span class="bg-[#2a2a2a] border border-[#3a3a3a] rounded px-2.5 py-1 text-[0.7rem] font-medium text-gray-300">
                {{ t('common.footer.invoice') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-[#2a2a2a] my-8" />

        <!-- Language + Legal -->
        <div class="flex items-center justify-between flex-wrap gap-4">
        <!-- Language selector -->
        <div class="flex items-center gap-2">
          <template v-for="(lang, i) in LANGUAGES" :key="lang.code">
            <span v-if="i > 0" class="text-gray-600">·</span>
            <button
              class="text-[0.78rem] transition-colors bg-transparent border-none cursor-pointer"
              :class="locale === lang.code ? 'text-white font-bold' : 'text-gray-400 hover:text-white'"
              @click="switchLanguage(lang.code)"
            >
              {{ lang.label }}
            </button>
          </template>
        </div>

        <!-- Legal links -->
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-gray-600 text-xs">© {{ year }}</span>
          <span class="text-gray-600 text-[0.7rem]">·</span>
          <router-link
            :to="{ name: 'agb', params: { locale: currentLocale() } }"
            class="text-[0.78rem] hover:text-white transition-colors"
          >
            {{ t('common.footer.terms') }}
          </router-link>
          <span class="text-gray-600 text-[0.7rem]">·</span>
          <router-link
            :to="{ name: 'impressum', params: { locale: currentLocale() } }"
            class="text-[0.78rem] hover:text-white transition-colors"
          >
            {{ t('common.footer.imprint') }}
          </router-link>
          <span class="text-gray-600 text-[0.7rem]">·</span>
          <router-link
            :to="{ name: 'datenschutz', params: { locale: currentLocale() } }"
            class="text-[0.78rem] hover:text-white transition-colors"
          >
            {{ t('common.footer.privacy') }}
          </router-link>
        </div>
      </div>
    </div>
    </div>

    <!-- Coop Group bar -->
    <div class="bg-[#111] py-3 border-t border-[#2a2a2a] text-center">
      <span class="text-gray-500 text-xs">{{ t('common.footer.coop_group') }}</span>
    </div>
  </footer>
</template>
