<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import { useFavorites, useRemoveFavorite } from '../composables/useFavorites';
import { formatPrice } from '@/shared/utils/formatters';
import { useToast } from 'primevue/usetoast';
import EmptyState from '@/shared/components/ui/EmptyState.vue';

const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const locale = computed(() => (route.params.locale as string) || 'de');

const { data: favorites, isLoading } = useFavorites();
const removeFav = useRemoveFavorite();

function handleRemove(productId: string) {
  removeFav.mutate(productId, {
    onSuccess: () => toast.add({ severity: 'info', summary: t('favorites.removed'), life: 3000 }),
  });
}
</script>

<template>
  <div data-testid="favorites-page">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ t('favorites.title') }}</h1>

    <div v-if="isLoading" class="py-8 text-center text-gray-400">
      <i class="pi pi-spin pi-spinner text-2xl" />
    </div>

    <div v-else-if="favorites && favorites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="fav in favorites"
        :key="fav._id"
        class="bg-white border rounded-lg p-4 flex flex-col"
      >
        <template v-if="fav.product">
          <router-link :to="`/${locale}/products/${fav.product.slug}`" class="no-underline">
            <img
              :src="fav.product.images?.[0]?.src?.sm || '/placeholder.png'"
              :alt="fav.product.name"
              class="w-full h-40 object-contain mb-3"
            />
            <div class="text-sm font-semibold text-gray-900 line-clamp-2">{{ fav.product.name_short || fav.product.name }}</div>
            <div class="text-sm font-bold text-[#d32f2f] mt-1">{{ formatPrice(fav.product.price) }}</div>
          </router-link>
        </template>
        <div class="mt-auto pt-3">
          <Button
            icon="pi pi-heart-fill"
            severity="danger"
            text
            size="small"
            :label="t('cart.remove')"
            @click="handleRemove(fav.product_id)"
          />
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      icon="pi-heart"
      :title="t('favorites.empty.title')"
      :description="t('favorites.empty.subtitle')"
    >
      <Button
        :label="t('favorites.empty.cta')"
        severity="danger"
        size="small"
        @click="$router.push(`/${locale}`)"
      />
    </EmptyState>
  </div>
</template>
