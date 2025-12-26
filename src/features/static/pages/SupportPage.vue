<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const sidebarItems = [
  { key: 'helpcenter', icon: 'pi-question-circle' },
  { key: 'contact', icon: 'pi-envelope' },
  { key: 'shipping', icon: 'pi-truck' },
  { key: 'repairs', icon: 'pi-wrench' },
  { key: 'returns', icon: 'pi-replay' },
  { key: 'order_docs', icon: 'pi-file' },
  { key: 'cancel', icon: 'pi-times-circle' },
];

const contactChannels = [
  { icon: 'pi-phone', titleKey: 'common.contact.phone_title', valueKey: 'common.contact.phone_number', subtitleKey: 'common.contact.phone_hours' },
  { icon: 'pi-envelope', titleKey: 'common.contact.email_title', valueKey: 'common.contact.email_address', subtitleKey: null },
];
</script>

<template>
  <div data-testid="support-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-3xl font-bold mb-6">{{ t('common.pages.support.title') }}</h1>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Sidebar -->
      <aside class="lg:w-64 shrink-0">
        <nav class="space-y-1">
          <div
            v-for="item in sidebarItems"
            :key="item.key"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <i :class="['pi', item.icon, 'text-[#d32f2f]']" />
            <span class="text-sm font-medium">{{ t(`common.pages.support.sidebar_${item.key}`) }}</span>
          </div>
        </nav>
      </aside>

      <!-- Content -->
      <div class="flex-1 space-y-8">
        <!-- Contact channels -->
        <section>
          <h2 class="text-xl font-semibold mb-4">{{ t('common.contact.title') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="channel in contactChannels"
              :key="channel.titleKey"
              class="flex items-start gap-4 p-5 border border-gray-200 rounded-lg"
            >
              <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <i :class="['pi', channel.icon, 'text-[#d32f2f]']" />
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ t(channel.titleKey) }}</h3>
                <p class="text-sm text-[#d32f2f] font-medium mt-1">{{ t(channel.valueKey) }}</p>
                <p v-if="channel.subtitleKey" class="text-xs text-gray-500 mt-0.5">{{ t(channel.subtitleKey) }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Support topics -->
        <section>
          <h2 class="text-xl font-semibold mb-4">{{ t('common.pages.support.sidebar_support') }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="item in sidebarItems"
              :key="item.key"
              class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#d32f2f] transition-colors cursor-pointer"
            >
              <i :class="['pi', item.icon, 'text-lg text-[#d32f2f]']" />
              <span class="font-medium text-gray-800">{{ t(`common.pages.support.sidebar_${item.key}`) }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
  </div>
</template>
