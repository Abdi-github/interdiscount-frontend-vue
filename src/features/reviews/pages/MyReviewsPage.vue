<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import Rating from 'primevue/rating';
import Button from 'primevue/button';
import { useMyReviews, useDeleteReview } from '../composables/useReviews';
import { formatDate } from '@/shared/utils/formatters';
import { useToast } from 'primevue/usetoast';
import EmptyState from '@/shared/components/ui/EmptyState.vue';
import type { ReviewProduct } from '../types';

const { t } = useI18n();
const route = useRoute();
const toast = useToast();
const locale = computed(() => (route.params.locale as string) || 'de');

const { data: reviews, isLoading } = useMyReviews();
const deleteReview = useDeleteReview();

function handleDelete(id: string) {
  deleteReview.mutate(id, {
    onSuccess: () => toast.add({ severity: 'info', summary: t('reviews.my_reviews.deleted'), life: 3000 }),
    onError: () => toast.add({ severity: 'error', summary: t('reviews.my_reviews.delete_error'), life: 3000 }),
  });
}

function getProductName(productId: string | ReviewProduct): string {
  if (typeof productId === 'object') return productId.name;
  return '';
}

function getProductSlug(productId: string | ReviewProduct): string {
  if (typeof productId === 'object') return productId.slug;
  return '';
}
</script>

<template>
  <div data-testid="my-reviews-page">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ t('reviews.my_reviews.title') }}</h1>

    <div v-if="isLoading" class="py-8 text-center text-gray-400">
      <i class="pi pi-spin pi-spinner text-2xl" />
    </div>

    <div v-else-if="reviews && reviews.length > 0" class="space-y-4">
      <div
        v-for="review in reviews"
        :key="review._id"
        class="bg-white border rounded-lg p-5"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <router-link
              v-if="getProductSlug(review.product_id)"
              :to="`/${locale}/products/${getProductSlug(review.product_id)}`"
              class="text-sm font-medium text-[#d32f2f] hover:underline"
            >
              {{ getProductName(review.product_id) }}
            </router-link>
            <div class="flex items-center gap-2 mt-1">
              <Rating :modelValue="review.rating" :readonly="true" :cancel="false" />
              <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
              >
                {{ review.is_approved ? t('reviews.my_reviews.approved') : t('reviews.my_reviews.pending') }}
              </span>
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mt-2">{{ review.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ review.comment }}</p>
            <div class="text-xs text-gray-400 mt-2">{{ formatDate(review.created_at) }}</div>
          </div>
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            size="small"
            :loading="deleteReview.isPending.value"
            @click="handleDelete(review._id)"
          />
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      icon="pi-star"
      :title="t('reviews.my_reviews.empty_title')"
      :description="t('reviews.my_reviews.empty_subtitle')"
    >
      <Button
        :label="t('reviews.my_reviews.browse_products')"
        severity="danger"
        size="small"
        @click="$router.push(`/${locale}`)"
      />
    </EmptyState>
  </div>
</template>
