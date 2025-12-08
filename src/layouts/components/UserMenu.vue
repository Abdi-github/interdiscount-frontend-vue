<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import Menu from 'primevue/menu';
import Badge from 'primevue/badge';
import type { MenuItem } from 'primevue/menuitem';
import { useAuthStore } from '@/stores/auth.store';
import { useNotifications } from '@/features/notifications/composables/useNotifications';
import { useLogout } from '@/features/auth/composables/useAuth';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const logout = useLogout();

const menu = ref<InstanceType<typeof Menu>>();

const locale = () => (route.params.locale as string) || 'de';

const { data: notifications } = useNotifications();

const unreadCount = () => {
  if (!notifications.value) return 0;
  return (notifications.value as Array<{ read_at?: string | null }>).filter((n) => !n.read_at).length;
};

const menuItems: MenuItem[] = [
  {
    label: () => t('common.nav.account'),
    items: [
      {
        label: () => t('profile.tabs.dashboard'),
        icon: 'pi pi-home',
        command: () => router.push({ name: 'dashboard', params: { locale: locale() } }),
      },
      {
        label: () => t('common.nav.orders'),
        icon: 'pi pi-box',
        command: () => router.push({ name: 'orders', params: { locale: locale() } }),
      },
      {
        label: () => t('common.nav.favorites'),
        icon: 'pi pi-heart',
        command: () => router.push({ name: 'favorites', params: { locale: locale() } }),
      },
      {
        label: () => t('common.nav.notifications'),
        icon: 'pi pi-bell',
        command: () => router.push({ name: 'notifications', params: { locale: locale() } }),
      },
      {
        label: () => t('profile.tabs.reviews'),
        icon: 'pi pi-star',
        command: () => router.push({ name: 'my-reviews', params: { locale: locale() } }),
      },
      {
        label: () => t('common.nav.profile'),
        icon: 'pi pi-user',
        command: () => router.push({ name: 'profile', params: { locale: locale() } }),
      },
      { separator: true },
      {
        label: () => t('common.nav.logout'),
        icon: 'pi pi-sign-out',
        class: 'text-red-500',
        command: () => logout(),
      },
    ],
  },
];

function toggleMenu(event: Event) {
  menu.value?.toggle(event);
}
</script>

<template>
  <div data-testid="user-menu">
    <!-- Guest: show login link -->
    <router-link
      v-if="!authStore.isAuthenticated"
      :to="{ name: 'login', params: { locale: locale() } }"
      class="text-gray-800 hover:text-[#d32f2f] p-1.5 transition-colors"
      :title="t('common.nav.login')"
    >
      <i class="pi pi-user text-lg" />
    </router-link>

    <!-- Authenticated: avatar dropdown -->
    <button
      v-else
      class="relative text-gray-800 hover:text-[#d32f2f] p-1.5 transition-colors"
      :title="t('common.nav.account')"
      @click="toggleMenu"
    >
      <i class="pi pi-user text-lg" />
      <Badge
        v-if="unreadCount() > 0"
        :value="unreadCount()"
        severity="danger"
        class="!absolute -top-0.5 -right-0.5 !text-[0.6rem] !min-w-[16px] !h-[16px]"
      />
    </button>

    <Menu
      ref="menu"
      :model="menuItems"
      :popup="true"
      class="w-56"
    />
  </div>
</template>
