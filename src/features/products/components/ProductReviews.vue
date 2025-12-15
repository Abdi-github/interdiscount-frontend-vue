<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Rating from 'primevue/rating';
import Paginator from 'primevue/paginator';
import { useProductReviews } from '../composables/useProducts';
import type { Product } from '../types';
import { useAuthStore } from '@/stores/auth.store';
import { reviewsApi } from '@/features/reviews/api/reviews.api';
import { useToast } from 'primevue/usetoast';
import { formatDate } from '@/shared/utils/formatters';

const props = defineProps<{
  product: Product;
}>();

const { t } = useI18n();
const authStore = useAuthStore();
const toast = useToast();

const page = ref(1);
const limit = ref(5);
const reviewParams = computed(() => ({ page: page.value, limit: limit.value }));
const productId = computed(() => props.product._id);
const { data: reviewsData, isLoading, refetch } = useProductReviews(productId, ref(reviewParams.value));

watch(reviewParams, (val) => {
  // Trigger refetch when params change
  void val;
});

const reviews = computed(() => reviewsData.value?.data ?? []);
const totalRecords = computed(() => reviewsData.value?.pagination?.total ?? 0);

// Review form
const showForm = ref(false);
const formRating = ref(5);
const formTitle = ref('');
const formComment = ref('');
const isSubmitting = ref(false);

function onPageChange(event: { page: number }) {
  page.value = event.page + 1;
}

async function submitReview() {
  if (!formTitle.value.trim() || !formComment.value.trim()) return;
  isSubmitting.value = true;
  try {
    await reviewsApi.createReview({
      product_id: props.product._id,
      rating: formRating.value,
      title: formTitle.value,
      comment: formComment.value,
    });
    toast.add({ severity: 'success', summary: t('reviews.form.success'), life: 3000 });
    formTitle.value = '';
    formComment.value = '';
    formRating.value = 5;
    showForm.value = false;
    refetch();
  } catch {
    toast.add({ severity: 'error', summary: t('reviews.form.error'), life: 3000 });
  } finally {
    isSubmitting.value = false;
  }
}

// Rating distribution (computed from available reviews)
const ratingBars = computed(() => {
  const counts = [0, 0, 0, 0, 0]; // 1-5 stars
  for (const r of reviews.value) {
    const idx = Math.min(Math.max(Math.round(r.rating) - 1, 0), 4);
    counts[idx]++;
  }
  const total = reviews.value.length || 1;
  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star - 1],
    percent: (counts[star - 1] / total) * 100,
  }));
});
</script>

<template>
  <div data-testid="product-reviews">
    <!-- Rating summary -->
    <div class="flex flex-col sm:flex-row gap-6 mb-6">
      <!-- Average -->
      <div class="text-center min-w-[120px]">
        <div class="text-5xl font-extrabold text-[#d32f2f]">{{ product.rating.toFixed(1) }}</div>
        <Rating :modelValue="product.rating" :readonly="true" :cancel="false" class="mt-1" />
        <div class="text-sm text-gray-500 mt-1">{{ t('reviews.count', { count: product.review_count }) }}</div>
      </div>

      <!-- Distribution bars -->
      <div class="flex-1">
        <div v-for="bar in ratingBars" :key="bar.star" class="flex items-center gap-2 mb-1">
          <span class="text-sm text-gray-600 w-4 text-right">{{ bar.star }}</span>
          <i class="pi pi-star-fill text-yellow-400 text-xs" />
          <div class="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              class="bg-[#d32f2f] h-full rounded-full transition-all"
              :style="{ width: `${bar.percent}%` }"
            />
          </div>
          <span class="text-sm text-gray-500 w-6 text-right">{{ bar.count }}</span>
        </div>
      </div>
    </div>

    <!-- Write review button -->
    <div v-if="authStore.isAuthenticated && !showForm" class="mb-4">
      <button
        class="bg-[#d32f2f] text-white px-4 py-2 rounded font-semibold hover:bg-[#b71c1c] transition-colors text-sm"
        @click="showForm = true"
      >
        {{ t('reviews.write') }}
      </button>
    </div>

    <!-- Review form -->
    <div v-if="showForm" data-testid="review-form" class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <h4 class="font-semibold text-gray-900 mb-3">{{ t('reviews.write') }}</h4>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviews.form.rating_label') }}</label>
        <Rating v-model="formRating" :cancel="false" />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviews.form.title_label') }}</label>
        <input
          v-model="formTitle"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#d32f2f] focus:border-transparent outline-none"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('reviews.form.body_label') }}</label>
        <textarea
          v-model="formComment"
          rows="4"
          class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-[#d32f2f] focus:border-transparent outline-none resize-none"
        />
      </div>

      <div class="flex gap-2">
        <button
          class="bg-[#d32f2f] text-white px-4 py-2 rounded font-semibold hover:bg-[#b71c1c] transition-colors text-sm disabled:opacity-50"
          :disabled="isSubmitting || !formTitle.trim() || !formComment.trim()"
          @click="submitReview"
        >
          {{ t('reviews.form.submit') }}
        </button>
        <button
          class="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
          @click="showForm = false"
        >
          {{ t('common.cancel') }}
        </button>
      </div>
    </div>

    <!-- Reviews list -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <i class="pi pi-spin pi-spinner text-2xl text-gray-400" />
    </div>

    <div v-else-if="reviews.length === 0" class="text-gray-500 py-6">
      {{ t('reviews.no_reviews') }}
    </div>

    <div v-else>
      <div v-for="review in reviews" :key="review._id" class="border-b border-gray-100 pb-4 mb-4 last:border-0">
        <div class="flex items-center gap-2 mb-1">
          <Rating :modelValue="review.rating" :readonly="true" :cancel="false" size="small" />
          <span class="font-semibold text-gray-900 text-sm">{{ review.title }}</span>
        </div>
        <div class="text-xs text-gray-500 mb-2">
          {{ review.user?.first_name }} {{ review.user?.last_name?.charAt(0) }}.
          &nbsp;·&nbsp;
          {{ formatDate(review.created_at) }}
        </div>
        <p class="text-sm text-gray-700 m-0">{{ review.comment }}</p>
      </div>

      <!-- Pagination -->
      <Paginator
        v-if="totalRecords > limit"
        :rows="limit"
        :totalRecords="totalRecords"
        :first="(page - 1) * limit"
        @page="onPageChange"
        class="mt-4"
      />
    </div>
  </div>
</template>
