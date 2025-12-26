<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface ServiceItem {
  key: string;
  icon: string;
}

const sections: { titleKey: string; items: ServiceItem[] }[] = [
  {
    titleKey: 'common.pages.service.section_extras',
    items: [
      { key: 'garantie_plus', icon: 'pi-shield' },
      { key: 'mobile_protection', icon: 'pi-mobile' },
      { key: 'pc_easy', icon: 'pi-desktop' },
      { key: 'mobile_easy', icon: 'pi-tablet' },
      { key: 'delivery_install', icon: 'pi-truck' },
      { key: 'cewe', icon: 'pi-image' },
      { key: 'trade_in', icon: 'pi-sync' },
    ],
  },
  {
    titleKey: 'common.pages.service.section_info',
    items: [
      { key: 'smart_help', icon: 'pi-headphones' },
      { key: 'stores', icon: 'pi-map-marker' },
      { key: 'helpcenter', icon: 'pi-question-circle' },
      { key: 'contact', icon: 'pi-envelope' },
    ],
  },
  {
    titleKey: 'common.pages.service.section_after',
    items: [
      { key: 'returns', icon: 'pi-replay' },
      { key: 'repairs', icon: 'pi-wrench' },
      { key: 'battery', icon: 'pi-bolt' },
      { key: 'spare_parts', icon: 'pi-cog' },
    ],
  },
  {
    titleKey: 'common.pages.service.section_order',
    items: [
      { key: 'order_docs', icon: 'pi-file' },
      { key: 'cancel_order', icon: 'pi-times-circle' },
      { key: 'payment', icon: 'pi-credit-card' },
      { key: 'shipping', icon: 'pi-box' },
    ],
  },
];
</script>

<template>
  <div data-testid="service-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-3xl font-bold mb-2">{{ t('common.pages.service.title') }}</h1>

    <div v-for="section in sections" :key="section.titleKey" class="mt-10">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">{{ t(section.titleKey) }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="item in section.items"
          :key="item.key"
          class="flex items-start gap-4 p-5 border border-gray-200 rounded-lg hover:border-[#d32f2f] hover:shadow-sm transition-all cursor-pointer"
        >
          <i :class="['pi', item.icon, 'text-2xl text-[#d32f2f] mt-0.5']" />
          <div>
            <h3 class="font-semibold text-gray-900">{{ t(`common.pages.service.${item.key}`) }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ t(`common.pages.service.${item.key}_desc`) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
