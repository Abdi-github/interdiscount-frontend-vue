<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import Badge from 'primevue/badge';
import { useAuthStore } from '@/stores/auth.store';
import { useCartStore } from '@/stores/cart.store';
import { useUiStore } from '@/stores/ui.store';
import UserMenu from './UserMenu.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();
const uiStore = useUiStore();

const searchQuery = ref('');
const locale = () => (route.params.locale as string) || 'de';

function handleSearch(e: Event) {
  e.preventDefault();
  const q = searchQuery.value.trim();
  if (q) {
    router.push({ name: 'search', params: { locale: locale() }, query: { q } });
    searchQuery.value = '';
  }
}

function openMiniCart() {
  uiStore.sidebarOpen = true;
}
</script>

<template>
  <header data-testid="header" class="sticky top-0 z-50 bg-white border-t-[3px] border-t-[#d32f2f] border-b border-b-gray-200 shadow-sm">
    <div class="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center gap-3 h-[56px] sm:h-[64px] w-full">
      <!-- Mobile menu toggle -->
      <button
        data-testid="mobile-menu-toggle"
        class="md:hidden text-gray-800 hover:text-[#d32f2f] p-1"
        @click="uiStore.toggleMobileMenu()"
      >
        <i class="pi pi-bars text-xl" />
      </button>

      <!-- Logo -->
      <router-link
        :to="{ name: 'home', params: { locale: locale() } }"
        class="flex items-center shrink-0 no-underline"
      >
        <img src="/logo.svg" alt="Interdiscount" class="h-10" />
      </router-link>

      <!-- Search bar (desktop) -->
      <form
        data-testid="search-bar"
        class="flex-1 max-w-[520px] mx-auto hidden md:flex items-center"
        @submit="handleSearch"
      >
        <div class="relative w-full">
          <input
            v-model="searchQuery"
            data-testid="search-input"
            type="text"
            :placeholder="t('common.search_placeholder')"
            class="w-full rounded pl-4 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#d32f2f] bg-white text-gray-900 placeholder:text-gray-400"
          />
          <button
            data-testid="search-submit"
            type="submit"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d32f2f] transition-colors"
          >
            <i class="pi pi-search text-sm" />
          </button>
        </div>
      </form>

      <!-- Right-side icons -->
      <div class="flex items-center gap-1 ml-auto shrink-0">
        <!-- User menu -->
        <UserMenu />

        <!-- Stores link (desktop) -->
        <router-link
          :to="{ name: 'stores', params: { locale: locale() } }"
          class="hidden md:flex items-center gap-1 text-gray-800 hover:text-[#d32f2f] px-2 py-1 text-[0.78rem] font-semibold transition-colors no-underline"
        >
          <i class="pi pi-shop text-base" />
          <span>{{ t('common.nav.stores') }}</span>
        </router-link>

        <!-- Compare (desktop) -->
        <button
          class="hidden sm:flex text-gray-800 hover:text-[#d32f2f] p-1.5 transition-colors"
          :title="t('common.nav.compare')"
        >
          <i class="pi pi-arrows-h text-lg" />
        </button>

        <!-- Favorites -->
        <router-link
          :to="authStore.isAuthenticated
            ? { name: 'favorites', params: { locale: locale() } }
            : { name: 'login', params: { locale: locale() } }"
          class="text-gray-800 hover:text-[#d32f2f] p-1.5 transition-colors no-underline"
          :title="t('common.nav.favorites')"
        >
          <i class="pi pi-heart text-lg" />
        </router-link>

        <!-- Cart -->
        <button
          data-testid="cart-icon"
          class="relative text-gray-800 hover:text-[#d32f2f] p-1.5 transition-colors"
          :title="t('common.nav.cart')"
          @click="openMiniCart"
        >
          <i class="pi pi-shopping-cart text-lg" />
          <Badge
            v-if="cartStore.itemCount > 0"
            data-testid="cart-badge"
            :value="cartStore.itemCount"
            severity="danger"
            class="!absolute -top-0.5 -right-0.5 !text-[0.6rem] !min-w-[16px] !h-[16px]"
          />
        </button>
      </div>
    </div>

    <!-- Mobile search bar -->
    <div class="md:hidden px-4 pb-3 border-t border-gray-100">
      <form class="relative mt-2" @submit="handleSearch">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('common.search_placeholder')"
          class="w-full rounded pl-4 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#d32f2f] bg-white text-gray-900 placeholder:text-gray-400"
        />
        <button type="submit" class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d32f2f]">
          <i class="pi pi-search text-sm" />
        </button>
      </form>
    </div>
  </header>
</template>
