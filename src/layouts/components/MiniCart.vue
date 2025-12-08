<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import { useUiStore } from '@/stores/ui.store';
import { useCartStore } from '@/stores/cart.store';
import { formatPrice } from '@/shared/utils/formatters';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const uiStore = useUiStore();
const cartStore = useCartStore();

const locale = () => (route.params.locale as string) || 'de';

function goToCart() {
  uiStore.sidebarOpen = false;
  router.push({ name: 'cart', params: { locale: locale() } });
}

function goToCheckout() {
  uiStore.sidebarOpen = false;
  router.push({ name: 'checkout', params: { locale: locale() } });
}

function removeItem(productId: number) {
  cartStore.removeItem(productId);
}
</script>

<template>
  <Drawer
    v-model:visible="uiStore.sidebarOpen"
    data-testid="mini-cart"
    position="right"
    :show-close-icon="false"
    class="w-80"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-lg font-bold text-gray-900">
          {{ t('cart.drawer_title') }}
          <span v-if="cartStore.itemCount > 0" class="text-sm font-normal text-gray-500">
            ({{ cartStore.itemCount }})
          </span>
        </h2>
        <button class="text-gray-500 hover:text-gray-700" @click="uiStore.sidebarOpen = false">
          <i class="pi pi-times text-lg" />
        </button>
      </div>
    </template>

    <!-- Empty state -->
    <div v-if="cartStore.isEmpty" class="flex flex-col items-center justify-center py-12 text-center">
      <i class="pi pi-shopping-cart text-5xl text-gray-300 mb-4" />
      <p class="text-gray-600 font-medium mb-1">{{ t('cart.empty.title') }}</p>
      <p class="text-sm text-gray-400 mb-4">{{ t('cart.empty.subtitle') }}</p>
      <Button
        :label="t('cart.empty.cta')"
        severity="secondary"
        outlined
        size="small"
        @click="uiStore.sidebarOpen = false"
      />
    </div>

    <!-- Cart items -->
    <div v-else class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto -mx-4 px-4">
        <div
          v-for="item in cartStore.items"
          :key="item.productId"
          class="flex gap-3 py-3 border-b border-gray-100"
        >
          <!-- Product image -->
          <img
            :src="item.image"
            :alt="item.name"
            class="w-16 h-16 object-contain rounded bg-gray-50 shrink-0"
          />

          <!-- Product info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
            <p class="text-sm text-gray-500 mt-0.5">
              {{ t('cart.quantity') }}: {{ item.quantity }}
            </p>
            <p class="text-sm font-semibold text-gray-900 mt-0.5">
              {{ formatPrice(item.price * item.quantity) }}
            </p>
          </div>

          <!-- Remove -->
          <button
            class="shrink-0 text-gray-400 hover:text-red-500 self-start"
            :title="t('cart.remove')"
            @click="removeItem(item.productId)"
          >
            <i class="pi pi-trash text-sm" />
          </button>
        </div>
      </div>

      <!-- Summary + actions -->
      <div class="border-t border-gray-200 pt-4 mt-auto -mx-4 px-4 pb-2">
        <div class="flex items-center justify-between mb-4">
          <span class="font-semibold text-gray-700">{{ t('cart.subtotal') }}</span>
          <span class="font-bold text-gray-900">{{ formatPrice(cartStore.subtotal) }}</span>
        </div>

        <div class="space-y-2">
          <Button
            :label="t('cart.checkout')"
            class="w-full"
            @click="goToCheckout"
          />
          <Button
            :label="t('cart.view_cart')"
            severity="secondary"
            outlined
            class="w-full"
            @click="goToCart"
          />
        </div>
      </div>
    </div>
  </Drawer>
</template>
