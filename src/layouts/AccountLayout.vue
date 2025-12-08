<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();

const locale = () => route.params.locale || 'de';

const navItems = [
  { label: () => t('profile.tabs.dashboard'), route: 'dashboard', icon: 'pi-home' },
  { label: () => t('profile.tabs.profile'), route: 'profile', icon: 'pi-user' },
  { label: () => t('orders.title'), route: 'orders', icon: 'pi-box' },
  { label: () => t('favorites.title'), route: 'favorites', icon: 'pi-heart' },
  { label: () => t('reviews.title'), route: 'my-reviews', icon: 'pi-star' },
  { label: () => t('notifications.title'), route: 'notifications', icon: 'pi-bell' },
];
</script>

<template>
  <div data-testid="account-layout" class="bg-white">
    <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="w-full lg:w-[260px] shrink-0">
          <nav class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <ul class="list-none m-0 p-0">
              <li v-for="item in navItems" :key="item.route" class="border-b border-gray-100 last:border-b-0">
                <router-link
                  :to="{ name: item.route, params: { locale: locale() } }"
                  class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#d32f2f] transition-colors no-underline"
                  active-class="!bg-red-50 !text-[#d32f2f] font-semibold"
                >
                  <i :class="['pi', item.icon, 'text-base w-5 text-center']" />
                  {{ item.label() }}
                </router-link>
              </li>
            </ul>
          </nav>
        </aside>

        <main class="flex-1 min-w-0">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>
