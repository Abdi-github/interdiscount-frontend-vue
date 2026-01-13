<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string;
  title: string;
  description?: string;
}>(), {
  icon: 'pi-inbox',
});
</script>

<template>
  <div data-testid="empty-state" class="flex flex-col items-center justify-center py-16 text-center">
    <i :class="['pi', icon, 'text-5xl text-surface-300 mb-4']" />
    <h3 class="text-lg font-semibold text-surface-700 mb-2">{{ title }}</h3>
    <p v-if="description" class="text-sm text-surface-500 max-w-md">{{ description }}</p>
    <div class="mt-6">
      <slot />
    </div>
  </div>
</template>
