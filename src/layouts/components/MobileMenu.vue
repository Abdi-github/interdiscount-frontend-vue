<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Drawer from 'primevue/drawer';
import { useUiStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { useLogout } from '@/features/auth/composables/useAuth';
import LanguageSwitcher from '@/shared/components/ui/LanguageSwitcher.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const authStore = useAuthStore();
const logout = useLogout();

const locale = () => (route.params.locale as string) || 'de';

const mainLinks = [
  { name: 'home', label: 'common.nav.home', icon: 'pi-home' },
  { name: 'search', label: 'common.nav.categories', icon: 'pi-th-large' },
  { name: 'brands', label: 'common.nav.brands', icon: 'pi-tag' },
  { name: 'stores', label: 'common.nav.stores', icon: 'pi-shop' },
  { name: 'aktionen', label: 'common.nav.aktionen', icon: 'pi-percentage' },
] as const;

function navigate(routeName: string) {
  uiStore.toggleMobileMenu();
  router.push({ name: routeName, params: { locale: locale() } });
}

function handleLogout() {
  uiStore.toggleMobileMenu();
  logout();
}
</script>

<template>
  <Drawer
    v-model:visible="uiStore.mobileMenuOpen"
    data-testid="mobile-menu"
    position="left"
    :show-close-icon="false"
    class="w-72"
  >
    <template #header>
      <div class="flex items-center justify-between w-full bg-[#d32f2f] text-white px-4 py-3 -mt-4 -mx-4">
        <div class="flex items-center gap-1.5">
          <img src="/logo.svg" alt="InterDiscount" class="h-7" style="filter: brightness(0) invert(1)" />
        </div>
        <button class="text-white hover:text-gray-200" @click="uiStore.toggleMobileMenu()">
          <i class="pi pi-times text-lg" />
        </button>
      </div>
    </template>

    <nav class="py-2">
      <!-- Main links -->
      <ul class="space-y-0.5">
        <li v-for="link in mainLinks" :key="link.name">
          <button
            class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            @click="navigate(link.name)"
          >
            <i :class="['pi', link.icon, 'text-lg w-6 text-center']" />
            {{ t(link.label) }}
          </button>
        </li>
      </ul>

      <div class="border-t border-gray-200 my-2" />

      <!-- Account links -->
      <ul class="space-y-0.5">
        <template v-if="authStore.isAuthenticated">
          <li>
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors" @click="navigate('profile')">
              <i class="pi pi-user text-lg w-6 text-center" />
              {{ t('common.nav.profile') }}
            </button>
          </li>
          <li>
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors" @click="navigate('orders')">
              <i class="pi pi-box text-lg w-6 text-center" />
              {{ t('common.nav.orders') }}
            </button>
          </li>
          <li>
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors" @click="navigate('favorites')">
              <i class="pi pi-heart text-lg w-6 text-center" />
              {{ t('common.nav.favorites') }}
            </button>
          </li>
          <li>
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors" @click="handleLogout">
              <i class="pi pi-sign-out text-lg w-6 text-center" />
              {{ t('common.nav.logout') }}
            </button>
          </li>
        </template>
        <template v-else>
          <li>
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors" @click="navigate('login')">
              <i class="pi pi-sign-in text-lg w-6 text-center" />
              {{ t('common.nav.login') }}
            </button>
          </li>
          <li>
            <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors" @click="navigate('register')">
              <i class="pi pi-user-plus text-lg w-6 text-center" />
              {{ t('common.nav.register') }}
            </button>
          </li>
        </template>
      </ul>

      <div class="border-t border-gray-200 my-2" />

      <!-- Language switcher -->
      <div class="px-4 py-2">
        <LanguageSwitcher />
      </div>
    </nav>
  </Drawer>
</template>
