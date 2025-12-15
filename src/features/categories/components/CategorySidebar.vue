<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Skeleton from 'primevue/skeleton';
import { useCategories } from '@/features/categories/composables/useCategories';
import { useLocalizedName } from '@/shared/composables/useLocalizedName';
import type { Category } from '@/features/categories/types';

const props = defineProps<{
  activeCategoryId?: string;
}>();

const route = useRoute();
const localizedName = useLocalizedName();

const locale = () => (route.params.locale as string) || 'de';

const { data: allCategories, isLoading } = useCategories();

const rootCategories = computed(() => {
  if (!allCategories.value) return [];
  return (allCategories.value as Category[])
    .filter((c) => !c.parent_id);
});
</script>

<template>
  <nav data-testid="category-sidebar" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <!-- Loading skeletons -->
    <div v-if="isLoading" class="p-3 space-y-1">
      <Skeleton v-for="i in 8" :key="i" height="32px" class="mb-1" />
    </div>

    <!-- Category list -->
    <ul v-else class="list-none p-0 m-0">
      <li v-for="cat in rootCategories" :key="cat._id" class="border-b border-gray-100 last:border-b-0">
        <router-link
          :to="{ name: 'category', params: { locale: locale(), slug: cat.slug } }"
          class="flex items-center justify-between py-2.5 px-4 text-[0.85rem] font-medium no-underline transition-colors"
          :class="cat._id === props.activeCategoryId
            ? 'text-[#d32f2f] bg-red-50 font-bold'
            : 'text-gray-700 hover:text-[#d32f2f] hover:bg-gray-50'"
        >
          {{ localizedName(cat.name) }}
          <i class="pi pi-chevron-right text-[0.55rem] text-gray-400" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>
