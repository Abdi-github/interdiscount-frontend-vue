<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import { useAuthStore } from '@/stores/auth.store';
import { useOrders } from '@/features/orders/composables/useOrders';
import { useFavorites } from '@/features/favorites/composables/useFavorites';
import { formatPrice, formatDate } from '@/shared/utils/formatters';
import EmptyState from '@/shared/components/ui/EmptyState.vue';
import { ref } from 'vue';

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const locale = computed(() => (route.params.locale as string) || 'de');

const orderParams = ref({ page: 1, limit: 3 });
const { data: ordersData, isLoading: ordersLoading } = useOrders(orderParams);
const { data: favorites } = useFavorites();

const recentOrders = computed(() => ordersData.value?.data ?? []);
const orderCount = computed(() => ordersData.value?.pagination?.total ?? 0);
const favCount = computed(() => favorites.value?.length ?? 0);
</script>

<template>
  <div data-testid="dashboard-page">
    <!-- Welcome -->
    <h1 class="text-2xl font-bold text-gray-900 mb-6">
      {{ t('profile.dashboard.welcome', { name: authStore.currentUser?.first_name ?? '' }) }}
    </h1>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-white rounded-lg border p-4 text-center">
        <div class="text-2xl font-bold text-[#d32f2f]">{{ orderCount }}</div>
        <div class="text-sm text-gray-500">{{ t('profile.dashboard.total_orders') }}</div>
      </div>
      <div class="bg-white rounded-lg border p-4 text-center">
        <div class="text-2xl font-bold text-[#d32f2f]">{{ favCount }}</div>
        <div class="text-sm text-gray-500">{{ t('profile.dashboard.total_favorites') }}</div>
      </div>
      <div class="bg-white rounded-lg border p-4 text-center">
        <div class="text-2xl font-bold" :class="authStore.currentUser?.is_verified ? 'text-green-600' : 'text-gray-400'">
          <i :class="authStore.currentUser?.is_verified ? 'pi pi-check-circle' : 'pi pi-times-circle'" />
        </div>
        <div class="text-sm text-gray-500">
          {{ authStore.currentUser?.is_verified ? t('profile.dashboard.verified') : t('profile.dashboard.not_verified') }}
        </div>
      </div>
    </div>

    <!-- Recent orders -->
    <div class="bg-white rounded-lg border p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">{{ t('profile.dashboard.recent_orders') }}</h2>
        <router-link
          v-if="recentOrders.length > 0"
          :to="{ name: 'orders', params: { locale } }"
          class="text-sm text-[#d32f2f] hover:underline"
        >
          {{ t('profile.dashboard.view_all') }}
        </router-link>
      </div>

      <div v-if="ordersLoading" class="py-8 text-center text-gray-400">
        <i class="pi pi-spin pi-spinner text-2xl" />
      </div>

      <div v-else-if="recentOrders.length > 0" class="space-y-3">
        <router-link
          v-for="order in recentOrders"
          :key="order._id"
          :to="{ name: 'order-detail', params: { locale, id: order._id } }"
          class="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors no-underline"
        >
          <div>
            <div class="text-sm font-medium text-gray-900">{{ order.order_number }}</div>
            <div class="text-xs text-gray-500">{{ formatDate(order.created_at) }}</div>
          </div>
          <div class="text-right">
            <div class="text-sm font-bold">{{ formatPrice(order.total) }}</div>
            <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {{ t(`orders.status.${order.status}`) }}
            </span>
          </div>
        </router-link>
      </div>

      <EmptyState
        v-else
        icon="pi-box"
        :title="t('profile.dashboard.no_orders')"
      >
        <Button
          :label="t('profile.dashboard.start_shopping')"
          severity="danger"
          size="small"
          @click="$router.push(`/${locale}`)"
        />
      </EmptyState>
    </div>
  </div>
</template>
