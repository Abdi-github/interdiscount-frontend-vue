<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const locale = () => (route.params.locale as string) || 'de';

const SERVICES = [
  { icon: 'pi-verified', key: 'guarantee_plus', route: 'contact' },
  { icon: 'pi-shop', key: 'free_pickup', route: 'stores' },
  { icon: 'pi-truck', key: 'free_shipping', route: 'support' },
];
</script>

<template>
  <section class="py-6" data-testid="services-strip">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">
        {{ t('home.services.heading') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          v-for="svc in SERVICES"
          :key="svc.key"
          :to="{ name: svc.route, params: { locale: locale() } }"
          class="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-[#d32f2f] hover:shadow-sm transition-all no-underline group"
        >
          <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <i :class="['pi', svc.icon, 'text-xl text-[#d32f2f]']" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-900 m-0 group-hover:text-[#d32f2f]">
              {{ t(`home.services.${svc.key}`) }}
            </p>
            <p class="text-[0.75rem] text-gray-500 m-0 mt-0.5">
              {{ t(`home.services.${svc.key}_desc`) }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </section>
</template>
