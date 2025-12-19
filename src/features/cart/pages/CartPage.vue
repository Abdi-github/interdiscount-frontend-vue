<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { useCartStore } from '@/stores/cart.store';
import { useAuthStore } from '@/stores/auth.store';
import { formatPrice } from '@/shared/utils/formatters';
import EmptyState from '@/shared/components/ui/EmptyState.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();
const authStore = useAuthStore();

const locale = computed(() => (route.params.locale as string) || 'de');

const FREE_SHIPPING_THRESHOLD = 49;
const SHIPPING_COST = 9.9;

const shippingCost = computed(() => (cartStore.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST));
const grandTotal = computed(() => cartStore.total + shippingCost.value);
const amountToFreeShipping = computed(() => Math.max(0, FREE_SHIPPING_THRESHOLD - cartStore.subtotal));

function goToCheckout() {
  if (authStore.isAuthenticated) {
    router.push(`/${locale.value}/checkout`);
  } else {
    router.push({ name: 'login', params: { locale: locale.value }, query: { redirect: `/${locale.value}/checkout` } });
  }
}
</script>

<template>
  <div data-testid="cart-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">
      {{ t('cart.title') }}
      <span v-if="!cartStore.isEmpty" class="text-base font-normal text-gray-500 ml-2">
        ({{ t('cart.item_count', { count: cartStore.itemCount }) }})
      </span>
    </h1>

    <!-- Empty state -->
    <EmptyState
      v-if="cartStore.isEmpty"
      icon="pi-shopping-cart"
      :title="t('cart.empty.title')"
      :description="t('cart.empty.subtitle')"
    >
      <Button
        :label="t('cart.empty.cta')"
        icon="pi pi-arrow-left"
        @click="router.push(`/${locale}`)"
      />
    </EmptyState>

    <!-- Cart with items -->
    <div v-else class="flex flex-col lg:flex-row gap-8">
      <!-- Items list -->
      <div class="flex-1">
        <div
          v-for="item in cartStore.items"
          :key="item.productId"
          :data-testid="`cart-item-${item.productId}`"
          class="flex gap-4 py-4 border-b border-gray-100 last:border-0"
        >
          <!-- Product image -->
          <router-link :to="`/${locale}/products/${item.slug}`" class="shrink-0">
            <img
              :src="item.image || '/placeholder.png'"
              :alt="item.name"
              class="w-20 h-20 object-contain rounded border border-gray-100"
            />
          </router-link>

          <!-- Product info -->
          <div class="flex-1 min-w-0">
            <router-link
              :to="`/${locale}/products/${item.slug}`"
              class="text-sm font-semibold text-gray-900 hover:text-[#d32f2f] line-clamp-2 no-underline"
            >
              {{ item.name }}
            </router-link>

            <!-- Price per unit -->
            <div class="mt-1 flex items-center gap-2">
              <span v-if="item.originalPrice && item.originalPrice > item.price" class="text-xs text-gray-400 line-through">
                {{ formatPrice(item.originalPrice) }}
              </span>
              <span class="text-sm font-bold text-gray-900">{{ formatPrice(item.price) }}</span>
            </div>

            <!-- Quantity + remove (mobile-friendly row) -->
            <div class="mt-2 flex items-center gap-3">
              <InputNumber
                :modelValue="item.quantity"
                @update:modelValue="(val: number | null) => cartStore.updateQuantity(item.productId, val ?? 1)"
                :min="1"
                :max="item.maxQuantity"
                showButtons
                buttonLayout="horizontal"
                :inputStyle="{ width: '2.5rem', textAlign: 'center' }"
                decrementButtonClass="p-button-text p-button-sm"
                incrementButtonClass="p-button-text p-button-sm"
                decrementButtonIcon="pi pi-minus"
                incrementButtonIcon="pi pi-plus"
              />
              <button
                class="text-gray-400 hover:text-red-500 transition-colors p-1"
                :title="t('cart.remove')"
                @click="cartStore.removeItem(item.productId)"
              >
                <i class="pi pi-trash text-sm" />
              </button>
            </div>
          </div>

          <!-- Line total -->
          <div class="text-right shrink-0">
            <span class="text-sm font-bold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>
        </div>
      </div>

      <!-- Summary sidebar -->
      <div data-testid="cart-summary" class="lg:w-80 shrink-0">
        <div class="bg-gray-50 rounded-lg p-6 sticky top-24">
          <!-- Free shipping progress -->
          <div v-if="amountToFreeShipping > 0" class="mb-4 text-sm text-gray-600">
            <i class="pi pi-truck text-[#d32f2f] mr-1" />
            {{ t('cart.free_shipping_hint', { amount: formatPrice(amountToFreeShipping) }) }}
          </div>
          <div v-else class="mb-4 text-sm text-green-600 font-medium">
            <i class="pi pi-check-circle mr-1" />
            {{ t('cart.shipping_free') }}
          </div>

          <!-- Totals -->
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">{{ t('cart.subtotal') }}</span>
              <span class="font-medium">{{ formatPrice(cartStore.subtotal) }}</span>
            </div>

            <div v-if="cartStore.couponDiscount > 0" class="flex justify-between text-green-600">
              <span>Rabatt</span>
              <span>-{{ formatPrice(cartStore.couponDiscount) }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-600">{{ t('cart.shipping') }}</span>
              <span class="font-medium">
                {{ shippingCost === 0 ? t('cart.shipping_free') : formatPrice(shippingCost) }}
              </span>
            </div>

            <div class="border-t border-gray-200 pt-2 mt-2 flex justify-between text-base font-bold">
              <span>{{ t('cart.total') }}</span>
              <span class="text-[#d32f2f]">{{ formatPrice(grandTotal) }}</span>
            </div>
          </div>

          <!-- Checkout button -->
          <Button
            data-testid="checkout-button"
            :label="t('cart.checkout')"
            icon="pi pi-lock"
            class="w-full mt-4"
            severity="danger"
            @click="goToCheckout"
          />

          <!-- Continue shopping -->
          <Button
            :label="t('cart.continue_shopping')"
            icon="pi pi-arrow-left"
            class="w-full mt-2"
            severity="secondary"
            text
            @click="router.push(`/${locale}`)"
          />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
