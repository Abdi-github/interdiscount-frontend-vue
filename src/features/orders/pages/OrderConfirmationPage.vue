<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import { useOrder } from '../composables/useOrders';
import { formatPrice, formatDate } from '@/shared/utils/formatters';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const locale = computed(() => (route.params.locale as string) || 'de');
const orderId = ref(route.params.id as string);
const { data: order, isLoading } = useOrder(orderId);
</script>

<template>
  <div data-testid="order-confirmation-page" class="max-w-2xl mx-auto px-4 py-12 text-center">
    <!-- Loading -->
    <div v-if="isLoading" class="py-20">
      <i class="pi pi-spin pi-spinner text-4xl text-[#d32f2f]" />
    </div>

    <template v-else-if="order">
      <!-- Success icon -->
      <div class="mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <i class="pi pi-check text-4xl text-green-600" />
        </div>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ t('orders.confirmation.title') }}</h1>
      <p class="text-gray-600 mb-6">
        {{ t('orders.confirmation.subtitle', { number: order.order_number }) }}
      </p>

      <!-- Order summary card -->
      <div class="bg-gray-50 rounded-lg p-6 text-left mb-8">
        <div class="flex justify-between text-sm mb-4">
          <span class="text-gray-500">{{ t('orders.order_number') }}</span>
          <span class="font-semibold">{{ order.order_number }}</span>
        </div>
        <div class="flex justify-between text-sm mb-4">
          <span class="text-gray-500">{{ t('orders.date') }}</span>
          <span>{{ formatDate(order.created_at) }}</span>
        </div>
        <div class="flex justify-between text-sm mb-4">
          <span class="text-gray-500">{{ t('orders.payment_method.' + order.payment_method) }}</span>
          <span>{{ t('orders.payment_status.' + order.payment_status) }}</span>
        </div>

        <!-- Items -->
        <div v-if="order.items" class="border-t pt-4 mt-4 space-y-2">
          <div v-for="item in order.items" :key="item._id" class="flex justify-between text-sm">
            <span class="text-gray-700">{{ item.product_name }} × {{ item.quantity }}</span>
            <span class="font-medium">{{ formatPrice(item.total_price) }}</span>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t pt-4 mt-4 space-y-1 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t('orders.detail.subtotal') }}</span>
            <span>{{ formatPrice(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">{{ t('orders.detail.shipping') }}</span>
            <span>{{ order.shipping_fee === 0 ? t('orders.detail.shipping_free') : formatPrice(order.shipping_fee) }}</span>
          </div>
          <div v-if="order.discount > 0" class="flex justify-between text-green-600">
            <span>{{ t('orders.detail.discount') }}</span>
            <span>-{{ formatPrice(order.discount) }}</span>
          </div>
          <div class="flex justify-between font-bold text-base border-t pt-2">
            <span>{{ t('orders.detail.total') }}</span>
            <span class="text-[#d32f2f]">{{ formatPrice(order.total) }}</span>
          </div>
        </div>

        <!-- Shipping address -->
        <div v-if="order.shipping_address" class="border-t pt-4 mt-4">
          <h3 class="text-sm font-semibold text-gray-700 mb-1">{{ t('orders.detail.shipping_address') }}</h3>
          <p class="text-sm text-gray-600">
            {{ order.shipping_address.street }} {{ order.shipping_address.street_number }}<br />
            {{ order.shipping_address.postal_code }} {{ order.shipping_address.city }}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          :label="t('orders.confirmation.view_order')"
          icon="pi pi-list"
          severity="secondary"
          outlined
          @click="router.push(`/${locale}/account/orders/${order._id}`)"
        />
        <Button
          :label="t('orders.confirmation.continue')"
          icon="pi pi-shopping-bag"
          severity="danger"
          @click="router.push(`/${locale}`)"
        />
      </div>
    </template>

    <!-- Not found -->
    <template v-else>
      <p class="text-gray-500">{{ t('orders.detail.not_found') }}</p>
    </template>
  </div>
</template>
