<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Paginator from 'primevue/paginator';
import SelectButton from 'primevue/selectbutton';
import { useOrders } from '../composables/useOrders';
import { formatPrice, formatDate } from '@/shared/utils/formatters';
import EmptyState from '@/shared/components/ui/EmptyState.vue';

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'de');

const page = ref(1);
const statusFilter = ref<string | undefined>(undefined);

const statusOptions = [
  { label: t('notifications.filter.all'), value: undefined },
  { label: t('orders.status.PROCESSING'), value: 'PROCESSING' },
  { label: t('orders.status.SHIPPED'), value: 'SHIPPED' },
  { label: t('orders.status.DELIVERED'), value: 'DELIVERED' },
  { label: t('orders.status.CANCELLED'), value: 'CANCELLED' },
];

const orderParams = computed(() => ({
  page: page.value,
  limit: 10,
  status: statusFilter.value,
}));

const { data: ordersData, isLoading } = useOrders(ref(orderParams.value));
const orders = computed(() => ordersData.value?.data ?? []);
const totalRecords = computed(() => ordersData.value?.pagination?.total ?? 0);

function onPageChange(event: { page: number }) {
  page.value = event.page + 1;
}
</script>

<template>
  <div data-testid="orders-list-page">
    <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ t('orders.title') }}</h1>

    <!-- Status filter -->
    <div class="mb-6">
      <SelectButton
        v-model="statusFilter"
        :options="statusOptions"
        optionLabel="label"
        optionValue="value"
        :allowEmpty="false"
      />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="py-8 text-center text-gray-400">
      <i class="pi pi-spin pi-spinner text-2xl" />
    </div>

    <!-- Orders -->
    <div v-else-if="orders.length > 0" class="space-y-3">
      <router-link
        v-for="order in orders"
        :key="order._id"
        :to="{ name: 'order-detail', params: { locale, id: order._id } }"
        class="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors no-underline"
      >
        <div>
          <div class="text-sm font-semibold text-gray-900">{{ order.order_number }}</div>
          <div class="text-xs text-gray-500 mt-0.5">{{ formatDate(order.created_at) }}</div>
          <div class="text-xs text-gray-500">{{ order.items?.length ?? 0 }} {{ t('orders.detail.items') }}</div>
        </div>
        <div class="text-right">
          <div class="text-sm font-bold">{{ formatPrice(order.total) }}</div>
          <span
            class="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
            :class="{
              'bg-green-100 text-green-700': order.status === 'DELIVERED' || order.status === 'PICKED_UP',
              'bg-blue-100 text-blue-700': order.status === 'SHIPPED' || order.status === 'PROCESSING',
              'bg-yellow-100 text-yellow-700': order.status === 'PENDING' || order.status === 'PLACED' || order.status === 'CONFIRMED',
              'bg-red-100 text-red-700': order.status === 'CANCELLED' || order.status === 'RETURNED',
              'bg-purple-100 text-purple-700': order.status === 'READY_FOR_PICKUP',
              'bg-gray-100 text-gray-700': order.status === 'PICKUP_EXPIRED',
            }"
          >
            {{ t(`orders.status.${order.status}`) }}
          </span>
        </div>
      </router-link>

      <Paginator
        v-if="totalRecords > 10"
        :rows="10"
        :totalRecords="totalRecords"
        :first="(page - 1) * 10"
        @page="onPageChange"
        class="mt-4"
      />
    </div>

    <!-- Empty -->
    <EmptyState
      v-else
      icon="pi-box"
      :title="t('orders.empty.title')"
      :description="t('orders.empty.subtitle')"
    >
      <router-link :to="`/${locale}`" class="text-[#d32f2f] hover:underline text-sm">
        {{ t('orders.empty.cta') }}
      </router-link>
    </EmptyState>
  </div>
</template>
