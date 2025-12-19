<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import { useOrder, useCancelOrder } from '../composables/useOrders';
import { formatPrice, formatDate } from '@/shared/utils/formatters';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const toast = useToast();
const locale = computed(() => (route.params.locale as string) || 'de');
const orderId = ref(route.params.id as string);

const { data: order, isLoading } = useOrder(orderId);
const cancelOrder = useCancelOrder();

const canCancel = computed(() => {
  if (!order.value) return false;
  return ['PENDING', 'PLACED', 'CONFIRMED'].includes(order.value.status);
});

function handleCancel() {
  if (!order.value) return;
  cancelOrder.mutate(order.value._id, {
    onSuccess: () => toast.add({ severity: 'info', summary: t('orders.cancelled'), life: 3000 }),
    onError: () => toast.add({ severity: 'error', summary: t('orders.cancel_error'), life: 3000 }),
  });
}
</script>

<template>
  <div data-testid="order-detail-page">
    <div v-if="isLoading" class="py-8 text-center text-gray-400">
      <i class="pi pi-spin pi-spinner text-2xl" />
    </div>

    <template v-else-if="order">
      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <button class="text-sm text-gray-500 hover:text-gray-700 mb-2" @click="router.push({ name: 'orders', params: { locale } })">
            <i class="pi pi-arrow-left mr-1 text-xs" /> {{ t('orders.detail.back') }}
          </button>
          <h1 class="text-xl font-bold text-gray-900">{{ order.order_number }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">{{ formatDate(order.created_at) }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="text-sm px-3 py-1 rounded-full font-medium"
            :class="{
              'bg-green-100 text-green-700': order.status === 'DELIVERED' || order.status === 'PICKED_UP',
              'bg-blue-100 text-blue-700': order.status === 'SHIPPED' || order.status === 'PROCESSING',
              'bg-yellow-100 text-yellow-700': order.status === 'PENDING' || order.status === 'PLACED' || order.status === 'CONFIRMED',
              'bg-red-100 text-red-700': order.status === 'CANCELLED' || order.status === 'RETURNED',
            }"
          >
            {{ t(`orders.status.${order.status}`) }}
          </span>
          <Button
            v-if="canCancel"
            :label="t('orders.detail.cancel')"
            severity="danger"
            text
            size="small"
            :loading="cancelOrder.isPending.value"
            @click="handleCancel"
          />
        </div>
      </div>

      <!-- Items -->
      <section class="bg-white rounded-lg border p-6 mb-6">
        <h2 class="text-sm font-semibold text-gray-700 mb-3">{{ t('orders.detail.items') }}</h2>
        <div v-if="order.items" class="divide-y divide-gray-100">
          <div v-for="item in order.items" :key="item._id" class="flex items-center gap-4 py-3">
            <img v-if="item.image_url" :src="item.image_url" :alt="item.product_name" class="w-14 h-14 object-contain rounded" />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900">{{ item.product_name }}</div>
              <div class="text-xs text-gray-500">{{ t('cart.quantity') }}: {{ item.quantity }} × {{ formatPrice(item.unit_price) }}</div>
            </div>
            <span class="text-sm font-bold">{{ formatPrice(item.total_price) }}</span>
          </div>
        </div>
      </section>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Shipping address -->
        <section v-if="order.shipping_address" class="bg-white rounded-lg border p-6">
          <h2 class="text-sm font-semibold text-gray-700 mb-3">{{ t('orders.detail.shipping_address') }}</h2>
          <p class="text-sm text-gray-600">
            {{ order.shipping_address.street }} {{ order.shipping_address.street_number }}<br />
            {{ order.shipping_address.postal_code }} {{ order.shipping_address.city }}<br />
            {{ order.shipping_address.canton }}, {{ order.shipping_address.country }}
          </p>
        </section>

        <!-- Payment & totals -->
        <section class="bg-white rounded-lg border p-6">
          <h2 class="text-sm font-semibold text-gray-700 mb-3">{{ t('orders.detail.summary') }}</h2>
          <div class="space-y-2 text-sm">
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
            <div class="pt-2 text-xs text-gray-500">
              {{ t('orders.detail.payment_chip', { method: t(`orders.payment_method.${order.payment_method}`) }) }}
            </div>
          </div>
        </section>
      </div>
    </template>

    <p v-else class="text-gray-500">{{ t('orders.detail.not_found') }}</p>
  </div>
</template>
