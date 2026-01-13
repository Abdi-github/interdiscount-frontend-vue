<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import { useNotifications, useMarkNotificationRead, useDeleteNotification } from '../composables/useNotifications';
import { formatDate } from '@/shared/utils/formatters';
import EmptyState from '@/shared/components/ui/EmptyState.vue';

const { t } = useI18n();

const { data: notifications, isLoading } = useNotifications();
const markRead = useMarkNotificationRead();
const deleteNotif = useDeleteNotification();

const unreadCount = computed(() => notifications.value?.filter((n) => !n.is_read).length ?? 0);

function handleClick(id: string, isRead: boolean) {
  if (!isRead) markRead.mutate(id);
}

function markAllRead() {
  notifications.value?.filter((n) => !n.is_read).forEach((n) => markRead.mutate(n._id));
}

const notifIcon: Record<string, string> = {
  order_status: 'pi-box',
  order_confirmed: 'pi-check',
  order_shipped: 'pi-truck',
  order_delivered: 'pi-check-circle',
  order_cancelled: 'pi-times-circle',
  pickup_ready: 'pi-building',
  review_approved: 'pi-star',
  price_drop: 'pi-tag',
  promotion: 'pi-megaphone',
  system: 'pi-info-circle',
};
</script>

<template>
  <div data-testid="notifications-page">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ t('notifications.title') }}
        <span v-if="unreadCount > 0" class="text-sm font-normal text-[#d32f2f] ml-2">({{ unreadCount }})</span>
      </h1>
      <Button
        v-if="unreadCount > 0"
        :label="t('notifications.mark_all_read')"
        icon="pi pi-check-circle"
        severity="secondary"
        text
        size="small"
        @click="markAllRead"
      />
    </div>

    <div v-if="isLoading" class="py-8 text-center text-gray-400">
      <i class="pi pi-spin pi-spinner text-2xl" />
    </div>

    <div v-else-if="notifications && notifications.length > 0" class="space-y-2">
      <div
        v-for="notif in notifications"
        :key="notif._id"
        class="flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer"
        :class="notif.is_read ? 'bg-white border-gray-100' : 'bg-red-50 border-red-200'"
        @click="handleClick(notif._id, notif.is_read)"
      >
        <i :class="['pi', notifIcon[notif.type] || 'pi-bell', 'text-lg mt-0.5', notif.is_read ? 'text-gray-400' : 'text-[#d32f2f]']" />
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-gray-900">{{ notif.title }}</div>
          <div class="text-sm text-gray-600 mt-0.5">{{ notif.message }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ formatDate(notif.created_at) }}</div>
        </div>
        <button
          class="text-gray-400 hover:text-red-500 p-1 shrink-0"
          @click.stop="deleteNotif.mutate(notif._id)"
        >
          <i class="pi pi-trash text-xs" />
        </button>
      </div>
    </div>

    <EmptyState
      v-else
      icon="pi-bell"
      :title="t('notifications.empty.title')"
      :description="t('notifications.empty.subtitle')"
    />
  </div>
</template>
